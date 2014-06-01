//

function test_start(mess) {
    console.log("START: ", mess);
};

function test_end(mess) {
    console.log("END: ", mess);
};

function test_001_001() {
    test_start("001_001");
   
    function end() {
        test_end("001_001");
    };

    function t_get_id(printers, end) {
        end();
    };

    query_local_printers(
            function(printers) { t_get_id(printers, end); },
            function() { console.log("Something change") }
            );
};

function test_001_002() {
    test_start("001_002");
   
    function end() {
        test_end("001_002");
    };

    function t_get_id(printers, end) {
        end();
    };

    chrome.usb.getDevices( {vendorId: 1208, productId: 514 }, function(device) {
        chrome.usb.openDevice(device[0], function(handle) {
            epson_open(handle, function(printer) {
                printer._get_status(function(r) {
                    console.log(r);
                });
            });
        });
    });
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
