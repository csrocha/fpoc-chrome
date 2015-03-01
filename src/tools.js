//
// Buffer Conversions
//
function _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        var ascii = binary_string.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes.buffer;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 1 bytes for each char. Only ASCII.
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function concatBuf(buf1, buf2) {
    var buf = new ArrayBuffer(buf1.byteLength + buf2.byteLength);
    var buf1View = new Uint8Array(buf1);
    var buf2View = new Uint8Array(buf2);
    var bufView = new Uint8Array(buf);
    for (var i=0; i < buf1.byteLength; i++) {
        bufView[i] = buf1View[i]
    }
    for (var i=0; i < buf2.byteLength; i++) {
        bufView[buf1.byteLength+i] = buf2View[i]
    }
    return buf;
}

//
// String tools
//
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


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

var query_local_printers = function(callback, onchange) {
    var change = false;
    var callback=callback;

    var inLocalPrinters = function(device, callback) {
        var inlp = false;
        for (p in local_printers) {
            inlp = inlp || local_printers[p].interface.sameDevice(device);
        }
        return inlp;
    };

    var cleanPrinters = function(callback) {
        var callback=callback;
        // Remove disconnected printers.
        async.eachSeries(takeKeys(local_printers),
                function(pid, __callback__) {
                    local_printers[pid].get_status(function(result) {
                        if (typeof result == 'undefined' || ('error' in result  && result.error == 'disconnected')) {
                            // Remove printer spool.
                            if (session) { session.del_printer(local_printers[pid]); }
                            // Close drivers.
                            local_printers[pid].close();
                            // Remove printer from list.
                            delete local_printers[pid];
                            change=true;
                        };
                        __callback__();
                    });
                },
                function() {
                    callback();
                });
    };

    var declarePrinter = function(port, protocol, device, callback) {
        var callback=callback;
        // Ignore declared devices.
        if (inLocalPrinters(device)) {
            callback();
            return;
        }
        // Check printer
        function check_printer(printer, result, callback) {
            if (result && !result.error) {
                var key = printer.protocol + '://' +
                    result.model + ":" +
                    result.serialNumber;
                if (key in local_printers) {
                    printer.close();
                } else {
                    console.debug("[FP] New printer " + key);
                    printer.name = key;
                    local_printers[key] = printer;
                    change=true;
                }
            } else {
                console.debug("[FP] Ignored device.");
                if (result && result.error) {
                    console.debug("[FP-ERROR]", result.error);
                }
                printer.close();
            };
            callback();
        };
        // Go for device.
        switch (protocol) {
        case 'epson_d_ar':
            epson_d_ar_open(device, port,
                function(printer) {
                  if (printer) {
                    printer.get_info(function(result){ check_printer(printer, result, callback); });
                  } else {
                    console.debug("[FP] No printer found.");
                    callback();
                  };
                });
            break;
         case 'epson_e_ar':
            epson_e_ar_open(device, port,
                function(printer) {
                  if (printer) {
                    printer.get_info(function(result){ check_printer(printer, result, callback); });
                  } else {
                    console.debug("[FP] No printer found.");
                    callback();
                  }
                });
        break;
        };
    };


    var onUsbDeviceFound = function(protocol, vendorId, productId, devices, callback) {
        var callback=callback;
        if (devices) {
            async.each(devices, function(device, __callback__) {
                declarePrinter('usb', protocol, device, __callback__);
            },
            function() {
                console.debug("[PF] USB devices found end");
                callback();
            });
        } else {
            console.debug("[PF] no USB devices found");
            callback();
        }
    }

    var onSerialDeviceFound = function(protocol, devices, callback) {
        var callback=callback;
        async.each(devices, function(device, __callback__) {
            declarePrinter('serial', protocol, device,
                function() { __callback__(); });
        },
        function() {
            console.debug("[PF] Serial found end");
            callback();
        });
    };

    var ___callback = function() {
        if (callback) callback(local_printers);
        if (change && onchange) { onchange(); }
    };

    cleanPrinters(function() {
        async.eachSeries(supported_printers, function(item, __callback__) {
                    switch (item.port) {
                    case 'usb':
                        usb_list_devices(
                                {"vendorId": item.vendorId, "productId": item.productId},
                                function(devices) {
                                    onUsbDeviceFound(item.protocol, item.vendorId, item.productId, devices,
                                        function() { __callback__(); });
                                });
                        break;
                    case 'serial':
                        serial_list_devices(
                                {},
                                function(devices) {
                                    onSerialDeviceFound(item.protocol, devices,
                                        function() { __callback__(); });
                                });
                        break;
                    };
                }, ___callback );
    });
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
