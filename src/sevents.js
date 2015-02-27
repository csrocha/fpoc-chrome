//
// Control server events.
//
control_server_events = {
    'list_printers': function(session, event_id, event_data, printers, callback) {
        var event_id = event_id;
        var tmpPrinters = [];
        var push_printers = function(keys, printers) {
            if (keys.length) {
                var key = keys.pop()
                printers[key].get_info(function(result){
                    tmpPrinters.push({
                        'uid': session.uid,
                        'sid': session.session_id,
                        'name': key,
                        'protocol': printers[key].protocol,
                        'model': result.model,
                        'pos': result.pos || false,
                        'serialNumber': result.serialNumber,
                        'fiscalStatus': printers[key].ar.fiscalState(result.fiscalStatus),
                        'printerStatus': printers[key].ar.printerState(result.fiscalStatus),
                        'firmwareName': result.firmwareName || false,
                        'firmwareVersion': result.firmwareVersion || false,
                        });
                    console.log(printers);
                    console.log(key);
                    push_printers(keys, printers);
                });
            } else {
                session.send({event_id: event_id, printers: tmpPrinters}, callback);
            };
        };

        var publish_printers = function(printers) {
            var keys = takeKeys(printers);
            push_printers(keys, printers);
        }

        console.debug("[EVENT] Query local printers.");
        query_local_printers( publish_printers );
    },
};

printer_server_events = {
    'short_test': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Short test.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.short_test(function(res){ session.send({'event_id': event_id, 'printer_id': printer_id}, callback); });
        }
    },
    'large_test': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Large test.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.large_test(function(res){ session.send({'event_id': event_id, 'printer_id': printer_id}, callback); });
        }
    },
    'advance_paper': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Advance paper.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.advance_paper(1, function(res){ session.send({'event_id': event_id, 'printer_id': printer_id}, callback); });
        }
    },
    'cut_paper': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Cut paper.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.cut_paper(function(res){ session.send({'event_id': event_id, 'printer_id': printer_id}, callback); });
        }
    },
    'open_fiscal_journal': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Open fiscal journal.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.open_fiscal_journal(function(res){ session.send({'event_id': event_id, 'printer_id': printer_id}, callback); });
        }
    },
    'close_fiscal_journal': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Close fiscal journal.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.close_fiscal_journal(function(res){ session.send({'event_id': event_id, 'printer_id': printer_id}, callback); });
        }
    },
    'shift_change': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Shift change.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.shift_change(function(res){ session.send({'event_id': event_id, 'printer_id': printer_id}, callback); });
        }
    },
    'get_status': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Get status.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.get_status(function(res){
                var response = res || {'error': 'no answer'};
                response['event_id'] = event_id;
                response['printer_id'] = printer_id;
                printer.get_datetime(function(res) {
                    if (res.date && res.time) {
                        var date = res.date;
                        var time = res.time;
                        response['clock'] = "20"+date.slice(4,6)+"-"+date.slice(2,4)+"-"+date.slice(0,2)+" "+time.slice(0,2)+":"+time.slice(2,4)+":"+time.slice(4,6);
                    } else {
                        response['error']='no date-time';
                    }
                    session.send(response,callback);
                });
            });
        }
    },
    'read_attributes': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Read attributes.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.read_attributes(function(res){
                var response = res || {'error': 'no answer'};
                response['event_id'] = event_id;
                response['printer_id'] = printer_id;
                session.send(response,callback);
            });
        }
    },
    'write_attributes': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Write attributes.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            async.eachSeries(takeKeys(event_data.attributes),
                    function(k, __callback__) {
                        var _callback_ = function(res) {
                            __callback__();
                        };
                        printer.write_field(k, event_data.attributes[k], _callback_)
                    },
                    function() {
                        session.send({ event_id: event_id, printer_id: printer_id },callback());
                    }
                    );
        }
    },
    'get_counters': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Get counters.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.get_counters(function(res){
                response = res || {'error': 'no answer'};
                response['event_id'] = event_id;
                response['printer_id'] = printer_id;
                session.send(response,callback);
            });
        }
    },
    'cancel_ticket_factura': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Cancel ticket factura.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.cancel_ticket_factura(function(res){
                response = res || {};
                response['event_id'] = event_id;
                response['printer_id'] = printer_id;
                session.send(response,callback);
            });
        }
    },
    'make_ticket_factura': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Make ticket factura.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.make_ticket_factura(
                    event_data['options'],
                    event_data['ticket'],
                    function(res){
                        response = res || {'error': 'no answer'};
                        response['event_id'] = event_id;
                        response['printer_id'] = printer_id;
                        session.send(response,callback);
                    });
        }
    },
    'cancel_ticket_notacredito': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Cancel ticket nota de crédito.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.cancel_ticket_notacredito(function(res){
                response = res || {};
                response['event_id'] = event_id;
                response['printer_id'] = printer_id;
                session.send(response,callback);
            });
        }
    },
    'make_ticket_notacredito': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Make ticket nota de crédito.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.make_ticket_notacredito(
                    event_data['options'],
                    event_data['ticket'],
                    function(res){
                        response = res || {'error': 'no answer'};
                        response['event_id'] = event_id;
                        response['printer_id'] = printer_id;
                        session.send(response,callback);
                    });
        }
    },
    'load_logos': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Load logos.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.load_logos(event_data['logos'],
                    function(res){
                        response = res || {};
                        response['event_id'] = event_id;
                        response['printer_id'] = printer_id;
                        session.send(response,callback);
                    });
        }
     },
    'remove_logos': function(session, event_id, event_data, printers, callback) {
        console.debug("[EVENT] Remove logos.");
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.delete_logo(function(res){
                        response = res || {};
                        response['event_id'] = event_id;
                        response['printer_id'] = printer_id;
                        session.send(response,callback);
                    });
        }
     },
};
// To take params from event:
// var parms = JSON.parse(ev.data);

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
