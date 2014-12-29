//
// Backgroup process application.
//

var session = null;

// Function searching for new printers or remove then if disconnected.
function poolingPrinter() {
    setTimeout(function(){
       console.debug("[FP] Pooling for printers");
       session.update(poolingPrinter);
    }, 6000);
};

function open_status(sess) {
    if (sess) {
        if (chrome.app.window.get('status') == null) {
            chrome.app.window.create('view/status.html', {
                'id': 'status',
                'bounds': {
                    'width': 640,
                    'height': 500
                },
                'minWidth': 640,
                'minHeight': 640
            }, function(sWindow) {
              sWindow.contentWindow.session = sess;
            });
        };
    } else {
        setTimeout(function() { open_status(sess); }, 1000);
    }
};

function login(callback) {
    console.debug("[SES] Start background login.");

    // Not login if exists session_id.
    if (session && session.session_id) {
        console.debug("[SES] I dont need login if a session exists.");
        return
    };
    
    // Login.
    chrome.storage.local.get(['server', 'session_id'], function(value) {
        console.debug("[SES] Creating the session.");
        session = new oerpSession(value.server, value.session_id);
        session.onlogin = function(s) {
            console.log("Successful login.");
            chrome.storage.local.set({
                server: session.server,
                session_id: session.session_id, });
                s.init_server_events(control_server_events, function() {
                //s.update();
            });
        };
        session.onlogout = function(s) {
            console.debug("[SES] Logout.");
            chrome.storage.local.set({
                server: null,
                session_id: null, });
        };
        session.onlogerror = function(s) {
            console.debug("[SES] Login error. Forget session_id.");
            chrome.storage.local.set({
                'session_id': null
            });
            open_status(session);
        };
        session.onerror = function(s) {
            console.debug("[SES] Session error. Forget session_id.");
            for (i in session.receptor) session.receptor[i].close();
            chrome.storage.local.set({
                'server': session.server,
                'session_id': null
            });
            open_status(session);
        };
        session.onexpired = function(s) {
            console.debug("[SES] Session expired. Forget session_id.");
            for (i in session.receptor) session.receptor[i].close();
            chrome.storage.local.set({
                'server': session.server,
                'session_id': null
            });
            open_status(session);
        };
        session.init(callback);
    });
};

// Start login.
login(function(){
    // Set status windows when application is launched.
    chrome.app.runtime.onLaunched.addListener(function() {
        console.debug("[SYS] Launch status");
        open_status(session);
    });
});

poolingPrinter();
// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
