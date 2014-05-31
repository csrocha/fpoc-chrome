//
// OpenERP Session object.
//

//
// Counter to make unique messages in same connection.
//
var idCounter = 0;
uniqueId = function(prefix) {
  var id = ++idCounter + '';
  return prefix ? prefix + id : id;
};

//
// Class to create a session associated to a server.
//
oerpSession = function(sid, server, session_id) {

    this.sid = sid;
    this.server = server;
    this.session_id = session_id;
    this.id = uniqueId('p');
    this.receptor = [];

    this.onlogin = null;
    this.onlogout = null;
    this.onmessage = null;
    this.onlogerror = null;
    this.onerror = null;
    this.onexpired = null;
    this.onchange = null;

    this.printers = null;
    this.lastOperationStatus = 'No info';

    //
    // Init general server event listener.
    //
    this.set_server_events = function(params, event_function_map, data, return_callback, callback) {
        var self = this;

        console.log("Create spool ", params);

        var receptor = new EventSource(this.server + "/fp/spool?" + params);
        receptor.onopen = function(ev) { console.log("OPEN!!!!", ev); };
        receptor.onerror = function(ev) { console.log("ERROR!!!!", ev); };
        receptor.onmessage = function(ev) { console.log("MESSAGE!!!!", ev); };

        async.each(takeKeys(event_function_map), function(event_key, __callback) {
                var event_callback = function(ev) {
                    var event_data = JSON.parse(ev.data);
                    var local_data = data;
                    if (self.onmessage) {
                        self.onmessage("in", ev.type);
                    }
                    event_function_map[ev.type](self, event_data, local_data, return_callback);
                };
                receptor.addEventListener(event_key, event_callback, false);
                self.receptor.push(receptor);
                __callback();
            },
            callback);
    };

    //
    // Add printer and set server event for each one.
    //
    this.add_printer = function(printer, event_function_map, callback) {
        var self = this;

        if (printer.is_connected || self.uid == null) return;
        printer.is_connected = true;

        var return_callback = function(mess, ev) { };

        this.set_server_events("session_id=" + this.session_id + "&printer_id=" + encodeURIComponent(printer.name),
                event_function_map,
                self.printers,
                return_callback,
                callback);
    };

    //
    // Init control server event listener.
    //
    this.init_server_events = function(event_function_map, callback) {
        var return_callback = function(mess, res) { self.update(); };
        this.set_server_events("session_id=" + this.session_id,
                event_function_map,
                null,
                return_callback,
                callback);
    };

    //
    // Execute expiration event
    //
    this._onexpiration = function(event) {
        var self = this;
        self.session_id = null;
        self.sid = null;
        if (self.onexpired) self.onexpired(event);
    };

    //
    // RPC wrapper
    //
    this.rpc = function(url, params, callback) {
        var xhr = new XMLHttpRequest();
        var self=this;
        var args = "?jsonp=_&id="+this.id
        if (self.session_id && self.sid) {
            //args = args + "&session_id=" + self.session_id + "&sid=" + self.sid;
            params.session_id = self.session_id;
        }
        var request = { 'params': params };
        args = args + "&r="+encodeURIComponent(JSON.stringify(request || {}));

        xhr.ontimeout = function(event) {
            self.onerror(event);
            callback("timeout", null);
        };
        xhr.onerror = function(event)   {
            self.onerror(event);
            callback("error", null);
        };
        xhr.onload = function(event) { 
            r = event.currentTarget.response;
            response = JSON.parse(r.substring(2,r.length-2));
            if (response.error) {
                console.error(response.error);
                callback("error", response.error);
                if (response.error.code = 300) self._onexpiration(event);
            } else {
                self.id = response.id || self.id;
                self.sid = response.httpsessionid;
                if (self.onmessage) {
                    self.onmessage("in", response.result);
                }
                callback("done", response.result);
            }
        };
        xhr.open("GET", this.server + url + args, true);
        xhr.timeout = 10000;
        xhr.withCredentials = true;
        xhr.send();
        if (self.onmessage) {
            self.onmessage("out", [url, args]);
        }
    };

    //
    // Read list of databases on the server.
    //
    this.get_database_list = function(callback) {
        this.rpc('/web/database/get_list', {}, callback);
    };

    //
    // Get session information.
    //
    this.get_session_info = function(callback) {
        var self=this;
        var old_uid = self.uid;
        this.rpc('/web/session/get_session_info', { 'session_id': self.session_id }, function(mess, result){
            if (mess == "done") {
                self.db = result.db;
                self.username = result.username;
                self.user_context = result.user_context;
                self.uid = result.uid;
                self.session_id = result.session_id;
                if (self.onlogin && self.uid) {
                    mess = 'logged';
                    self.onlogin(self);
                };
                if (self.onexpired && !self.uid) {
                    mess = 'expired';
                    self.onexpired(self);
                };
            } else {
                if (self.onlogerror && !self.uid) {
                    mess = 'logerror';
                    self.onlogerror(self);
                };
            };
            if (callback) {
                callback(mess, self);
            };
        });
    };

    //
    // Authenticate user in a db with a password.
    //
    this.authenticate = function(db, login, password, callback) {
        var self = this;
        var old_uid = self.uid;
        var params = { db: db, login: login, password: password, base_location: self.server };
        var _callback = function(mess, result) {
            if (mess == "done") {
                self.db = result.db;
                self.uid = result.uid;
                self.session_id = result.session_id;
                self.username = login;
                if (self.onlogin && old_uid != self.uid && self.uid != null) {
                    self.onlogin(self);
                };
                if (self.onlogerror && self.uid == null) {
                    self.onlogerror(self);
                };
            }
            if (callback) {
                callback(mess, result.uid && result.uid != null);
            };
        };
        this.rpc("/web/session/authenticate", params, _callback);
    };

    //
    // Logout
    //
    this.logout = function(callback) {
        var self = this;
        var params = {};
        var _callback = function(mess, result) {
            self.server = null;
            self.username = null;
            self.uid = null;
            self.session = null;
            if (self.onlogout) { self.onlogout(self); };
            if (callback) { callback(mess); };
        }
        this.rpc("/web/session/destroy", params, _callback);
    }

    //
    // Return none.
    //
    this.send = function(value, callback) {
        var self = this;
        var _callback = function(mess, result) {
            if (callback) {
                callback(mess, result);
            };
        };
        this.rpc("/fp/push", value, _callback);
    };

    //
    // Publish printers.
    //
    this.send_info = function(printers, callback) {
        var self = this;
        var _callback = function(mess, result) {
            if (callback) {
                callback(mess, result);
            };
        };
        this.rpc("/fp/push", printers, _callback);
    };

    //
    // Check if server is online
    //
    this.check = function(callback) {
        var self = this;
        var _callback = function(mess, result) {
            if (callback) {
                callback(mess, result);
            };
        };
        this.rpc("/web/session/check", {}, _callback);

    };

    // 
    // Init the session in the server if exists.
    //
    this.init = function(callback) {
        var _callback = callback || function(mess, obj) {
            if (mess != "logged") {
                console.warn("Session is not open. Reason: ", mess);
            } else {
                console.warn("Session is open.");
            }
        };
        // Setup session information.
        if (this.session_id) {
            this.get_session_info(_callback);
        } else {
            _callback("notlogin", this);
        };
    };

    this._call = function(model, method, args, kwargs, callback) {
        this.rpc("/web/dataset/call_kw", {
            model: model,
            method: method,
            args: args,
            kwargs: kwargs
        }, callback);
    }

    //
    // Clean devices.
    //
    this.clean = function(callback) {
        var self = this;
        if (self.printers) {
            async.each(self.printers, function(e) { e.close(); }, callback);
        } else
            callback();
    }

    // 
    // Set session_id printer in server.
    //
    this.update = function(callback) {
        var self = this;

        // Take printers
        var push_printers = function(keys, printers, _callback) {
            if (keys.length && self.uid) {
                self._call('fiscal_printer.fiscal_printer', 'search',
                        [ [['name','in',keys]] ], {}, function(e, fps) {
                            if (e == 'error') {
                                async.each(takeKeys(self.printers), function(key, __callback) {
                                    self.printers[key].is_connected = false;
                                    __callback();
                                });
                            } else {
                                var d = new Date();
                                async.each(fps, function(fp, __callback) {
                                    self._call('fiscal_printer.fiscal_printer', 'write',
                                        [ fp, {
                                            'session_id':self.session_id,
                                            'lastUpdate': d,
                                        } ], {}, function(e, r) { __callback(); });
                                }, _callback);
                            }
                        })
            } else {
                _callback();
            };
        };

        var publish_printers = function(printers) {
            self.printers = printers;
            var keys = takeKeys(printers);
            push_printers(keys, printers, function() {
                async.each(keys, function(printer, __callback) {
                    console.log("Printers to publish:", printer);
                    self.add_printer(printers[printer], printer_server_events, __callback);
                }, callback);
            });
        }
        
        self.clean(function(){
            query_local_printers( publish_printers, self.onchange );
        });
    }
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
