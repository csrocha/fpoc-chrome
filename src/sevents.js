//
// Server events.
//
server_events = {
    'info': function(session, ev) {
        var parms = JSON.parse(ev.data);
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
                session.send_info({printers: tmpPrinters});
            };
        };

        var publish_printers = function(printers) {
            var keys = takeKeys(printers);
            push_printers(keys, printers);
        }

        console.log("Query local printers.");
        query_local_printers( publish_printers );
    },
    'test': function(session, ev) {
        var parms = JSON.parse(ev.data);
        var test_printers = function(printers) {
            var printer = printers[parms.name];
            if (printer) {
                printer.do_test(function(){ session.send_void(); });
            }
        };
        query_local_printers( test_printers );
    }
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
