//
// Status printer window.
//
var printer_table     = document.querySelector("#printers table");
var disconnected_div  = document.querySelector("#disconnected");
var connected_div     = document.querySelector("#connected");
var disconnect_button = document.querySelector("#connected button");
var connect_button    = document.querySelector("#disconnected button");
var server_input      = document.querySelector("select[name=server]");
var server_text       = document.querySelector("#server");
var server_href       = document.querySelector("a#server");
var login_text        = document.querySelector("#login");
var database_input    = document.querySelector("select[name='database']");
var login_input       = document.querySelector("input[name='login']");
var password_input    = document.querySelector("input[name='password']");
var login_button      = document.querySelector("button[name='login']");
var alert_text        = document.querySelector("#alert");
var logger_section    = document.querySelector("#logger");

function do_alert(message) {
    var message_element = document.createElement("p");
    message_element.textContent = message;
    alert_text.appendChild(message_element);
    window.setTimeout(function(){
        alert_text.removeChild(message_element);
    }, 5000);
};

function do_message(dir, message) {
    var message_element = document.createElement("p");
    message_element.textContent = dir + "|" + message;
    logger_section.appendChild(message_element);
}

function load_databases() {
    var on_error = function() {
        do_alert("Connection problem with OpenERP server " + session.server + ".");
        server_input.selectedIndex = 0;
        session.server = null;
    };
    if (session) {
        session.server = server_input.selectedOptions[0].attributes.value.value;
        session.get_database_list(function(mess, databases) {
            if (mess == "done") {
                for (var db in databases) {
                    var option = document.createElement("option");
                    option.text = databases[db];
                    option.value = databases[db];
                    database_input.add(option);
                }
            } else on_error();
        });
    } else on_error();
};

function update_view() {
	show_login = session && (session.uid != null);

	disconnected_div.hidden = show_login;
	connected_div.hidden = !show_login;

    server_text.textContent = session && session.server || "[NONE]";
    server_href.href = session && (session.server + "?db=" + session.db) || "[NONE]";
    login_text.textContent = session && session.username || "[NONE]";

    session.onmessage = do_message;
};

function update() {
	update_view();
	if (session) {
		session.get_session_info(function(sess) {
			update_view();
		});
	}
};

disconnect_button.onclick = function(event) {
	session.logout(function(ev){
		session.logout();
		update();
	});
};

server_input.onchange = function(event) {
	if (server_input.selectedIndex > 0) {
		load_databases();
        update_view()
	} else {
		//database_input.
	}
};

login_button.onclick = function(event) {
    session.authenticate(
        database_input.selectedOptions[0].attributes.value.value,
        login_input.value,
        password_input.value,
        function(result){
            if (result) {
                window.close();
            } else {
                do_alert("Error logging.");
            }
        });
};


update();

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
