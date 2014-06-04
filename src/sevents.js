//
// Control server events.
//
control_server_events = {
    'list_printers': function(session, event_data, printers, callback) {
        var tmpPrinters = [];
        var push_printers = function(keys, printers) {
            if (keys.length) {
                var key = keys.pop()
                printers[key].get_id(function(result){
                    tmpPrinters.push({
                        'name': key,
                        'protocol': printers[key].protocol,
                        'model': result.model,
                        'pos': result.pos,
                        'serialNumber': result.serialNumber,
                        'fiscalStatus': fiscalState(result.fiscalStatus),
                        'printerStatus': printerState(result.fiscalStatus),
                        'firmwareName': result.firmwareName,
                        'firmwareVersion': result.firmwareVersion,
                        });
                    console.log(printers);
                    console.log(key);
                    push_printers(keys, printers);
                });
            } else {
                session.send_info({printers: tmpPrinters}, callback);
            };
        };

        var publish_printers = function(printers) {
            var keys = takeKeys(printers);
            push_printers(keys, printers);
        }

        console.log("Query local printers.");
        query_local_printers( publish_printers );
    },
};

printer_server_events = {

    'short_test': function(session, event_data, printers, callback) {
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.short_test(function(){ session.send({'printer_id': printer_id}, callback); });
        }
    },
    'large_test': function(session, event_data, printers, callback) {
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.large_test(function(){ session.send({'printer_id': printer_id}, callback); });
        }
    },
    'advance_paper': function(session, event_data, printers, callback) {
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.advance_paper(1, function(){ session.send({'printer_id': printer_id}, callback); });
        }
    },
    'cut_paper': function(session, event_data, printers, callback) {
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.cut_paper(function(){ session.send({'printer_id': printer_id}, callback); });
        }
    },
    'open_fiscal_journal': function(session, event_data, printers, callback) {
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.open_fiscal_journal(function(){ session.send({'printer_id': printer_id}, callback); });
        }
    },
    'close_fiscal_journal': function(session, event_data, printers, callback) {
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.close_fiscal_journal(function(){ session.send({'printer_id': printer_id}, callback); });
        }
    },
    'shift_change': function(session, event_data, printers, callback) {
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.shift_change(function(){ session.send({'printer_id': printer_id}, callback); });
        }
    },
    'get_status': function(session, event_data, printers, callback) {
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.get_status(function(res){
                var response = res;
                response['printer_id'] = printer_id;
                printer.get_datetime(function(res) {
                    var date = res.date;
                    var time = res.time;
                    response['clock'] = "20"+date.slice(4,6)+"-"+date.slice(2,4)+"-"+date.slice(0,2)+" "+time.slice(0,2)+":"+time.slice(2,4)+":"+time.slice(4,6);
                    session.send(response,callback);
                });
            });
        }
    },
    'read_attributes': function(session, event_data, printers, callback) {
        var printer_id = event_data.name;
        if (typeof printers == 'object' && printer_id in printers) {
            var printer = printers[printer_id];
            printer.read_attributes(function(res){
                res['printer_id'] = printer_id;
                session.send(res,callback);
            });
        }
    }
};
// To take params from event:
// var parms = JSON.parse(ev.data);

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
