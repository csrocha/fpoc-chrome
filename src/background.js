//
// Backgroup process application.
//

var session = null;

function open_status(sess) {
    if (chrome.app.window.get('status') == null) {
        chrome.app.window.create('view/status.html', {
            'id': 'status',
            'bounds': {
              'width': 400,
              'height': 500
            }
        }, function(sWindow) {
          sWindow.contentWindow.session = sess;
        });
    };
};

function login(callback) {
    console.log("Start background login.");

    // Not login if exists session_id.
    if (session && session.session_id) {
        return
    };
    
    // Login.
    chrome.storage.local.get(['sid', 'server', 'session_id'], function(value) {
        session = new oerpSession(value.sid, value.server, value.session_id);
        session.onlogin = function(s) {
            chrome.storage.local.set({
                sid: session.sid,
                server: session.server,
                session_id: session.session_id, });
            s.init_server_events(control_server_events, function() {
                s.update();
            });
        };
        session.onlogout = function(s) {
            chrome.storage.local.set({
                sid: null,
                server: null,
                session_id: null, });
        };
        session.onlogerror = function(s) {
            chrome.storage.local.set({'sid': null});
            open_status(session);
        };
        session.onerror = function(s) {
            for (i in session.receptor) session.receptor[i].close();
            chrome.storage.local.set({'sid': null});
            open_status(session);
        };
        session.onexpired = function(s) {
            for (i in session.receptor) session.receptor[i].close();
            chrome.storage.local.set({'sid': null});
            open_status(session);
        };
        session.init(callback);
    });
};

// Start login.
login(function(){
    // Set status windows when application is launched.
    chrome.app.runtime.onLaunched.addListener(function() {
        console.log("Launch status");
        open_status(session);
    });
});

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
