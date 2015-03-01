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
oerpSession = function(server, session_id) {
    EventTarget.call(this);

    this.server = server;
    this.session_id = session_id;
    this.id = uniqueId('p');
    this.spools = {};

    this.onlogout = null;
    this.onmessage = null;
    this.onlogerror = null;
    this.onexpired = null;
    this.onchange = null;

    this.printers = null;
    this.lastOperationStatus = 'No info';


    //
    // Init general server event listener.
    //
    this.set_server_events = function(params, event_function_map, data, return_callback, callback, retry) {
        var self = this;
        var url = this.server + "/fp/spool?" + params;
        var callback = callback;

        console.log("Create spool ", params);

        if (url in self.spools) {
            console.log("Repeated spool. Ignore it.");
            if (callback) callback(self.spools[url]);
            return;
        }

        var receptor = new EventSource(url);

        self.spools[receptor.url] = receptor;

        receptor.onopen = function(ev) {
            self.dispatchEvent({type: 'spool_open', 'event': ev});
        };
        receptor.onerror = function(ev) {
            var url = ev.srcElement.url;
            self.spools[url].close();
            delete self.spools[url];
            self.dispatchEvent({type: 'spool_error', 'event': ev});
            self.dispatchEvent({type: 'spool_close', 'event': ev});
            if (retry) retry(event_function_map, callback);
        };
        receptor.onmessage = function(ev) {
            self.dispatchEvent({type: 'spool_message', 'event': ev});
        };

        receptor.addEventListener('close', function() {
            debugger;
        } , false);

        var _callback = function() {
            if (callback) callback(receptor.url);
        }

        async.each(takeKeys(event_function_map), function(event_key, __callback) {
                var event_callback = function(ev) {
                    var event_data = JSON.parse(ev.data);
                    var local_data = data;
                    event_function_map[ev.type](self, ev.lastEventId, event_data, local_data, return_callback);
                };
                receptor.addEventListener(event_key, event_callback, false);
                __callback();
            },
            _callback);
    };

    //
    // Remove printer spooler
    //
    this.del_printer = function(printer) {
        var self = this;
        var params = "session_id=" + self.session_id + "&printer_id=" + encodeURIComponent(printer.name);
        var url = self.server + "/fp/spool?" + params;

        if (url in self.spools) {
            console.log("[SES] Remote spool for printer ", printer.name)
            self.spools[url].close();
            delete self.spools[url];
            self.dispatchEvent({type: 'spool_close'});
        }
    }

    //
    // Add printer and set server event for each one.
    //
    this.add_printer = function(printer, event_function_map, callback) {
        var self = this;
        var callback = callback;

        if ((printer.spool && printer.spool.url in self.spools) || !self.uid) {
            callback();
            return;
        }

        var return_callback = function(mess, ev) {
            console.log(mess);
        };

        var _callback = function(url) {
            printer.spool = url;
            self.dispatchEvent({type: 'connection', 'printer': printer});
            if (callback) callback(url);
        };

        this.set_server_events("session_id=" + this.session_id + "&printer_id=" + encodeURIComponent(printer.name),
                event_function_map,
                self.printers,
                return_callback,
                _callback);
    };

    //
    // Init control event-sent server listener.
    //
    this.init_server_events = function(event_function_map, callback) {
        var self = this;
        var callback = callback;

        var return_callback = function(mess, res) {
            if (mess == 'error') {
                setTimeout(function() { self.init_server_events(event_function_map, callback); }, 3000);
            } else
                if(self.update) self.update();
        };

        var retry = function(event_function_map) {
            setTimeout(function() { self.init_server_events(event_function_map, callback); }, 3000);
        }

        if (this.session_id) {
            this.set_server_events("session_id=" + this.session_id,
                    event_function_map,
                    null,
                    return_callback,
                    callback,
                    retry);
        } else {
            retry(event_function_map);
        }
    };

    //
    // Clean event-set server
    //
    this.clean_server_events = function() {
        //var self = this;
        //for (i = 0; i < self.receptor.length; i++) {
        //  self.receptor[i].close();
        //};
        //delete self.receptor;
        //self.receptor = [];
    }

    //
    // Execute expiration event
    //
    this._onexpiration = function(event) {
        var self = this;
        self.session_id = null;
        if (self.onexpired) self.onexpired(event);
    };

    //
    // RPC wrapper
    //
    this.rpc = function(url, params, callback) {
        var xhr = new XMLHttpRequest();
        var self=this;
        var callback=callback;
        var args = "?jsonp=_&id="+this.id
        //if (self.session_id) {
        //    params.session_id = self.session_id;
        //}
        var request = { 'params': params };
        args = args + "&r="+encodeURIComponent(JSON.stringify(request || {}));

        xhr.ontimeout = function(event) {
            self.dispatchEvent({type: 'error', 'event': event});
            callback("timeout", null);
        };
        xhr.onerror = function(event)   {
            self.dispatchEvent({type: 'error', 'event': event});
            callback("error", null);
        };
        xhr.onload = function(event) {
            r = event.currentTarget.response;
            try {
                response = JSON.parse(r.substring(2,r.length-2));
            } catch(err) {
                self.dispatchEvent({type: 'error', 'event': event});
                callback("error", null);
                return;
            }
            if (response.error) {
                console.error(response.error);
                callback("error", response.error);
                if (response.error.code = 300) self._onexpiration(event);
            } else {
                self.id = response.id || self.id;
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
        var self=this;
        var callback=callback;
        self.rpc('/web/database/get_list', {}, callback);
    };

    //
    // Get session information.
    //
    this.get_session_info = function(callback) {
        var self=this;
        var callback=callback;
        var old_uid = self.uid;
        self.rpc('/web/session/get_session_info', {  }, function(mess, result){
            if (mess == "done") {
                self.db = result.db;
                self.username = result.username;
                self.user_context = result.user_context;
                self.uid = result.uid;
                self.session_id = result.session_id;
                if (self.uid) {
                    self.dispatchEvent('login');
                } else {
                    self.dispatchEvent('expired');
                }
            } else {
                if (!self.uid) {
                    self.dispatchEvent('login_error');
                };
            };
            if (callback) {
                callback(mess, self);
            };
        });
    };

    //
    // Authenticate user in a db with a password.
    // NADIE LO USA!
    //
    this.authenticate = function(db, login, password, callback) {
        var self = this;
        var callback=callback;
        var old_uid = self.uid;
        var params = { db: db, login: login, password: password, base_location: self.server };
        var _callback = function(mess, result) {
            if (mess == "done") {
                self.db = result.db;
                self.uid = result.uid;
                self.session_id = result.session_id;
                self.username = login;
                if (old_uid != self.uid && self.uid != null) {
                    self.dispatchEvent('login');
                };
                if (self.uid == null) {
                    self.dispatchEvent('login_error');
                };
            }
            if (callback) {
                callback(mess, result && result.uid && result.uid != null);
            };
        };
        self.rpc("/web/session/authenticate", params, _callback);
    };

    //
    // Logout
    //
    this.logout = function(callback) {
        var self = this;
        var callback=callback;
        var params = {};
        var _callback = function(mess, result) {
            self.username = null;
            self.uid = null;
            self.session = null;
            self.spools = {};
            self.dispatchEvent('logout');
            if (callback) { callback(mess); };
        }
        self.rpc("/web/session/destroy", params, _callback);
    }

    //
    // Return value to the server.
    //
    this.send = function(value, callback) {
        var self = this;
        var callback=callback;
        var _callback = function(mess, result) {
            self.dispatchEvent({type: 'send', 'message': mess, 'result': result});
            if (callback) {
                callback(mess, result);
            };
        };
        self.rpc("/fp/push", value, _callback);
    };

    //
    // Check if server is online
    //
    this.check = function(callback) {
        var self = this;
        var callback=callback;
        var _callback = function(mess, result) {
            self.dispatchEvent({type: 'check', 'message': mess, 'result': result});
            if (callback) {
                callback(mess, result);
            };
        };
        self.rpc("/web/session/check", {}, _callback);
    };

    //
    // Init the session in the server if exists.
    //
    this.init = function(callback) {
        var self = this;
        var callback=callback;
        var _callback = callback || function(mess, obj) {
            if (mess != "logged") {
                console.warn("Session is not open. Reason: ", mess);
            } else {
                console.warn("Session is open.");
            }
        };
        // Setup session information.
        if (self.session_id) {
            self.get_session_info(_callback);
        } else {
            self.dispatchEvent('error');
            _callback("notlogin", this);
        };
    };

    this._call = function(model, method, args, kwargs, callback) {
        var self = this;
        var callback=callback;
        self.rpc("/web/dataset/call_kw", {
            model: model,
            method: method,
            args: args,
            kwargs: kwargs
        }, callback);
    }

    //
    // Clean devices and sessions.
    //
    this.clean_printers = function(callback) {
        var self = this;
        var callback=callback;
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
        var callback=callback;

        console.debug('[SES] Updating printers.');
        // Take printers
        var push_printers = function(keys, printers, _callback) {
            if (session_id && keys.length && self.uid) {
                self._call('fpoc.fiscal_printer', 'search',
                        [ [['name','in',keys]] ], {}, function(e, fps) {
                            if (e == 'error') {
                                async.each(takeKeys(self.printers), function(key, __callback) {
                                    self.printers[key].is_connected = false;
                                    __callback();
                                });
                            } else {
                                var d = new Date();
                                async.each(fps, function(fp, __callback) {
                                    self._call('fpoc.fiscal_printer', 'write',
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

        var final_callback = function(res) {
            callback();
        }

        var publish_printers = function(printers) {
            self.printers = printers;
            var keys = takeKeys(printers);
            push_printers(keys, printers, function() {
                async.each(keys, function(printer, __callback) {
                    console.debug("[SES] Printers to publish:", printer);
                    self.add_printer(printers[printer], printer_server_events, __callback);
                }, final_callback);
            });
        }

        self.clean_printers(function(){
            query_local_printers( publish_printers, self.onchange );
        });
    };
};

oerpSession.prototype = new EventTarget();
oerpSession.constructor = oerpSession;

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
