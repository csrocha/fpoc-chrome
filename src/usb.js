//
// UBS abstract controller.
//
var usb = function(device) {
    var self = this;
    self.device = device;
    self.handle = null;
    self.type = 'usb';
    self.interface = 0;

    this.open = function(callback) {
        var self = this;
        var callback = callback;
        chrome.usb.openDevice(device, function(handle) {
            if (chrome.runtime.lastError) {
                console.error("[USB]", chrome.runtime.lastError.message)
                return callback();
            };
            self.handle = handle;
            chrome.usb.claimInterface(self.handle, self.interface, function() {
                if (chrome.runtime.lastError) {
                    console.error("[USB]", chrome.runtime.lastError.message)
                    return callback();
                } else {
                    return callback(self);
                }
            });
        });
    };

    this.send = function(data, callback) {
        var self = this;
        var callback = callback;
        chrome.usb.bulkTransfer(self.handle,
            {   'direction': 'out',
                'endpoint': 0x01,
                'data': data,
            }, function(res) {
                if (chrome.runtime.lastError) {
                  console.error("[USB]", chrome.runtime.lastError.message)
                  if (chrome.runtime.lastError.message == "Transfer stalled") {
                    chrome.usb.interruptTransfer(self.handle, {
                      'direction': 'out',
                      'endpoint': 0x01,
                      'data': data,
                      }, function(res) {
                        if (chrome.runtime.lastError) {
                          console.error("[USB]", chrome.runtime.lastError.message);
                        };
                        self.send(data, callback);
                      });
                  } else {
                    callback(res);
                  }
                } else {
                  callback(res);
                }
            });
    };

    this.receive = function(callback) {
        var self = this;
        var callback = callback;
        chrome.usb.bulkTransfer(self.handle,
            {   'direction': 'in',
                'endpoint': 0x82,
                'length': 2048,
            }, function(res) {
                if (chrome.runtime.lastError) {
                    console.error("[USB]", chrome.runtime.lastError.message)
                    callback();
                } else {
                    if (res.data.byteLength == 0) {
                        setTimeout(function() {
                            self.receive(callback);
                        }, 100);
                    } else {
                        callback(res);
                    }
                }
            });
    };

    this.alive = function(true_callback, false_callback) {
        var self = this;
        var callback = callback;
        chrome.usb.listInterfaces(self.handle, function(res) { // Check if device still alive.
            if (chrome.runtime.lastError) {
                    console.error("[USB]", chrome.runtime.lastError.message)
            };
            if(res != null) { true_callback() } else { false_callback(); };
        });
    };

    this.close = function(callback) {
        var self = this;
        var callback = callback;
        chrome.usb.releaseInterface(self.handle, 0, function() {
            if (chrome.runtime.lastError) {
                    console.error("[USB]", chrome.runtime.lastError.message)
            }
            chrome.usb.closeDevice(self.handle, function() {
            if (chrome.runtime.lastError) {
                    console.error("[USB]", chrome.runtime.lastError.message)
            };
            callback();
            });
        });
    };

    this.sameDevice = function(device) {
        return device.device && device.device == self.device.device;
    };
};

var usb_list_devices = function(options, callback){
    chrome.usb.getDevices(options, function(ret) {
        if (chrome.runtime.lastError) {
                console.error("[USB]", chrome.runtime.lastError.message)
        };
        callback(ret);
    });
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
