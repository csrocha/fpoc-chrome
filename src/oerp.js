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

    this.onlogin = null;
    this.onlogout = null;
    this.onmessage = null;
    this.onlogerror = null;
    this.onerror = null;

    //
    // Init server event listener.
    //
    this.init_server_events = function(event_function_map) {
        var self = this;
        this.receptor = new EventSource(this.server + "/fp/fp_spool?session_id=" + this.session_id);
        this.receptor.onopen = function(ev) { console.log("OPEN!!!!", ev); };
        this.receptor.onerror = function(ev) { console.log("ERROR!!!!", ev); };
        this.receptor.onmessage = function(ev) { console.log("MESSAGE!!!!", ev); };
        for (event_key in event_function_map) {
            this.receptor.addEventListener(event_key, function(ev) {
                if (self.onmessage) {
                    self.onmessage("in", event_key);
                }
                event_function_map[event_key](self, ev);
            }, false);
        };
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

        console.log("rpc", url, args);
        xhr.ontimeout = function(event) {
            self.onerror(event);
            callback("timeout", null);
        };
        xhr.onerror = function(event)   {
            self.onerror(event);
            callback("error", null);
        };
        xhr.onload = function(event)    { console.log("<<<<<< OK", url); 
            r = event.currentTarget.response;
            response = JSON.parse(r.substring(2,r.length-2));
            self.id = response.id || self.id;
            self.sid = response.httpsessionid;
            if (self.onmessage) {
                self.onmessage("in", response.result);
            }
            callback("done", response.result);
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
                if (self.onlogin && old_uid != self.uid && self.uid != null && self.receptor == null) {
                    self.onlogin(self);
                };
                if (self.onlogerror && self.uid == null) {
                    self.onlogerror(self);
                };
            }
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
    this.send_void = function(callback) {
        var self = this;
        var _callback = function(mess, result) {
            if (callback) {
                callback(mess, result);
            };
        };
        this.rpc("/fp/fp_void", {}, _callback);
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
        this.rpc("/fp/fp_info", printers, _callback);
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
            if (mess != "done") {
                console.warn("Session is not open. Reason: ", mess);
            } else {
                debugger;
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

    // 
    // Publish printer information
    //
    this.publish = function(callback) {
        var self = this;

        // Take printers
        var push_printers = function(keys, printers) {
            if (keys.length) {
                debugger;
            };
        };
        var publish_printers = function(printers) {
            var keys = takeKeys(printers);
            push_printers(keys, printers);
        }
        console.log("Query local printers.");
        query_local_printers( publish_printers );


        // Search
        var _callback = function(r, d) {
            debugger;
        };
        args = [ [['session_id','=',self.session_id]] ];
        args = [ [] ]
        kwargs = { };
        this.rpc("/web/dataset/call_kw", {
            model: 'fiscal_printer.fiscal_printer',
            method: 'search',
            args: args,
            kwargs: kwargs
        }, _callback);

        // Write
        args = [ [id], data ];
        kwargs = { };
        this.rpc("/web/dataset/call_kw", {
            model: 'fiscal_printer',
            method: 'write',
            args: args,
            kwargs: kwargs
        });
    }
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
