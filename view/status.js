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
var login_text        = document.querySelector("b#login");
var database_text     = document.querySelector("b#database");
var database_input    = document.querySelector("select[name='database']");
var login_input       = document.querySelector("input[name='login']");
var password_input    = document.querySelector("input[name='password']");
var login_button      = document.querySelector("button[name='login']");
var alert_text        = document.querySelector("#alert");
var logger_section    = document.querySelector("#logger");

var buttons_html="\
<button id=\"short_test\">Short Test</button>\
<button id=\"large_test\">Large Test</button>\
<button id=\"advance_paper\">Avanzar Papel</button>\
<button id=\"cup_paper\">Cortar Papel</button>\
<button id=\"open_fiscal_journal\">Abrir jornada fiscal</button>\
<button id=\"close_fiscal_journal\">Cerrar jornada fiscal</button>\
<button id=\"shift_change\">Cambio de turno</button>\
";

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

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
    //update_view();
}

function load_databases() {
    var on_error = function() {
        do_alert("Connection problem with OpenERP server " + session.server + ".");
        server_input.selectedIndex = 0;
        session.server = null;
    };
    if (window.session) {
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
    if (window.session === undefined) {
        return;
    };
	show_login = window.session && session.uid;

	disconnected_div.hidden = show_login;
	connected_div.hidden = !show_login;

    server_text.textContent = session && session.server || "[NONE]";
    server_href.href = session && (session.server + "?db=" + session.db) || "[NONE]";
    login_text.textContent = session && session.username || "[NONE]";
    database_text.textContent = session && session.db || "[NONE]";

    // Remove printers
    for(var i = printer_table.rows.length - 1; i > 0; i--) {
        printer_table.deleteRow(1)
    };

    // Add printers
    for (p in session.printers) {
            var row = printer_table.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var printer = session.printers[p];
            row.setAttribute('printer_id', p);
            cell1.innerHTML = p;
            cell2.innerHTML = buttons_html;
            var getPrinter = function(e) { return session.printers[e.target.parentNode.parentNode.getAttribute('printer_id')]; };

            cell2.childNodes[0].addEventListener('click', function(e) {
                getPrinter(e).short_test(function(res) { do_alert("Finished short test."); });
            });
            cell2.childNodes[1].addEventListener('click', function(e) {
                getPrinter(e).large_test(function(res) { do_alert("Finished large test."); });
            });
            cell2.childNodes[2].addEventListener('click', function(e) {
                getPrinter(e).advance_paper(1, function(res) { do_alert("Paper advanced."); });
            });
            cell2.childNodes[3].addEventListener('click', function(e) {
                getPrinter(e).cut_paper(function(res) { do_alert("Paper cutted."); });
            });
            cell2.childNodes[4].addEventListener('click', function(e) {
                getPrinter(e).open_fiscal_journal(function(res) { do_alert("Fiscal Journal Opened."); });
            });
            cell2.childNodes[5].addEventListener('click', function(e) {
                getPrinter(e).close_fiscal_journal(function(res) { do_alert("Fiscal Journal Closed."); });
            });
            cell2.childNodes[6].addEventListener('click', function(e) {
                getPrinter(e).shift_change(function(res) { console.log(res); do_alert("Shift Turn done."); });
            });
    };
    session.onmessage = do_message;
};

function update() {
	if (window.session) {
		session.get_session_info(function(sess) {
			update_view();
		});
	} else {
	    update_view();
    }
};

window.update = update;

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
window.session.onchange = function() { update_view(); }

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
