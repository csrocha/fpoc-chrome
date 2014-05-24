//
// Take keys of a dict
//
function takeKeys(dict) {
    keys = [];
    for (var key in dict) {
        if(dict.hasOwnProperty(key)){
            keys.push(key);
        }
    }
    return keys;
};

//
// Search local printer pooler.
//
var local_printers = {};

var supported_printers = [
    { port: 'usb', protocol: 'epson', vendorId: 1208, productId: 514 },
    ];

var query_local_printers = function(callback) {

    var onDeviceFound = function(protocol, vendorId, productId, devices, _callback) {
        async.each(devices, function(item, __callback) {
                    switch (protocol) {
                    case 'epson':
                        epson_open(item,
                            function(printer) {
                                printer.get_status(function(result){
                                    printer.get_id(function(result){
                                        if (result) {
                                            var key = printer.protocol + '://' +
                                                result.model + ":" +
                                                result.serialNumber;
                                            if (key in local_printers) {
                                                printer.close(__callback);
                                                return;
                                            } else {
                                                console.log("New printer " + key);
                                                printer.name = key;
                                                local_printers[key] = printer;
                                                __callback();
                                                return
                                            }
                                        } else {
                                            console.warn("Device yet taken");
                                        }
                                        __callback();
                                        return;
                                    });
                                });
                            });
                    };
                },
                _callback);
    };

    var ___callback = function() {
        if (callback) callback(local_printers);
    };

    async.each(supported_printers,
            function(item, _callback) {
                switch (item.port) {
                case 'usb':
                    chrome.usb.findDevices(
                            {"vendorId": item.vendorId, "productId": item.productId},
                            function(device) {
                                onDeviceFound(item.protocol, item.vendorId, item.productId, device, _callback);
                            });
                };
            }, ___callback );
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
