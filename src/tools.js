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
var local_devices = {};

var supported_printers = [
    { port: 'usb', protocol: 'epson', vendorId: 1208, productId: 514 },
    ];

var query_local_printers = function(callback) {

    var declarePrinter = function(protocol, handle, _callback) {
        switch (protocol) {
        case 'epson':
            epson_open(handle,
                function(printer) {
                    printer.get_status(function(result){
                        printer.get_id(function(result){
                            if (result) {
                                var key = printer.protocol + '://' +
                                    result.model + ":" +
                                    result.serialNumber;
                                if (key in local_printers) {
                                    printer.close(_callback);
                                } else {
                                    console.log("New printer " + key);
                                    printer.name = key;
                                    local_printers[key] = printer;
                                }
                            } else {
                                console.warn("Device yet taken");
                                _callback();
                            }
                        });
                    });
                });
        };
    };

    var onDeviceFound = function(protocol, vendorId, productId, devices, callback) {
        var protocol = protocol;
        var devices = devices;
        var callback = callback;
        // Remove devices if not connected.
        async.each(takeKeys(local_devices), function(item, __callback) {
            var remove = true;
            for(i in devices) { remove &= (devices[i]['device'] != item); };
            if (remove) {
                console.log("Remove device");
                chrome.usb.closeDevice(local_devices[item], function() { 
                    async.each(takeKeys(local_printers), function(key, ___callback) {
                        if (local_printers[key].device.handle == local_devices[item].handle) {
                            delete local_devices[item];
                            delete local_printers[key];
                        }
                        ___callback();
                    }, __callback );
                });
            } else {
                __callback();
            }
        }, function() {
            // Create new devices.
            async.each(devices, function(item, __callback) {
                if (item['device'] in local_devices) {
                    console.log("Device yet exists.");
                    __callback();
                } else {
                    console.log("New device.");
                    chrome.usb.openDevice(item, function(handle){
                        local_devices[item['device']] = handle;
                        declarePrinter(protocol, handle, function() { __callback(); });
                    });
                };
            }, callback);
        });
    };

    var ___callback = function() {
        if (callback) callback(local_printers);
    };

    async.each(supported_printers, function(item, _callback) {
                switch (item.port) {
                case 'usb':
                    //chrome.usb.findDevices(
                    chrome.usb.getDevices(
                            {"vendorId": item.vendorId, "productId": item.productId},
                            function(devices) {
                                onDeviceFound(item.protocol, item.vendorId, item.productId, devices, _callback);
                            });
                };
            }, ___callback );
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
