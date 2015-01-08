//
// Serial abstract controller.
//

function indexof(buf, Symbol, Escape) {
    var vbuf = new Uint8Array(buf);
    for (var i = 0; i < vbuf.length && vbuf[i] != Symbol; i++) { }
    if (i > 0 && vbuf[i-1] == Escape) {
        return indexofSTX(buf.slice(i));
    } else {
        return i;
    }
}

var serial = function(device) {
    var connection = null;
    var receive_callback = null;
    var self = this;
    var buffer = new ArrayBuffer();
    var bufferRef = 0;

    this.device = device;
    this.type = 'serial';

    this.onReceive = function(receiveInfo) {
      console.log("ReceiveInfo:");
      console.log(receiveInfo);
      console.log("Connection:");
      console.log(connection);
      if (receiveInfo.connectionId === connection.connectionId) {
        var dataView = new Uint8Array(receiveInfo.data);
        buffer = concatBuf(buffer, receiveInfo.data);
      }
    };

    chrome.serial.onReceive.addListener(this.onReceive);

    this.open = function(callback) {
        var self = this;
        var callback = callback;
        chrome.serial.connect(device.path, {},
                function(connInfo) {
                    connection = connInfo;
                    callback(self);
                });
    };

    this.close = function(callback) {
        chrome.serial.disconnect(connection.connectionId, callback);
    };

    this.send = function(data, callback) { 
        var self = this;
        var callback = callback;
        buffer = buffer.slice(bufferRef);
        bufferRef = 0;
        chrome.serial.send(connection.connectionId, data,
                function(res) {
                    if (res.error) {
                        res.resultCode = -1;
                    } else {
                        res.resultCode = 0;
                    }
                    callback(res);
                });
 
    };

    this.receive = function(callback, count) {
        var count = typeof count != 'undefined' ? count : 10; 
        var __callback = callback;
        if (count < 0) {
            callback();
            return;
        }

        if (buffer.byteLength > 0 && bufferRef < buffer.byteLength) {
            var bv = new Uint8Array(buffer);
            if (bv[bufferRef] == 0x15 || bv[bufferRef] == 0x06) {
                var r = { 'resultCode': 0, 'data':  buffer.slice(bufferRef, bufferRef + 1) };
                bufferRef++;
                callback(r);
            } else {
                var stx_idx = indexof(buffer.slice(bufferRef), 0x02, 0x1B);
                var etx_idx = indexof(buffer.slice(bufferRef), 0x03, 0x1B);
                if (bufferRef <= stx_idx && stx_idx < etx_idx && etx_idx+4 < buffer.byteLength) {
                    var r = { 'resultCode': 0, 'data':  buffer.slice(stx_idx, etx_idx + 1 + 4) };
                    bufferRef=etx_idx+1+4;
                    callback(r);
                } else { 
                    setTimeout(function() { self.receive(callback, count-1); }, 100);
                }
            }
        } else {
            setTimeout(function() {
                self.receive(__callback, count-2);
            }, 100);
        };
    };

    this.alive = function(alive_callback, dead_callback) {
        alive_callback();
    };

    this.sameDevice = function(device) {
        return device.path && device.path == this.device.path;
    };
};

var serial_list_devices = function(options, callback){
    chrome.serial.getDevices(callback);
};

function test_serial() {
    chrome.serial.getDevices(function(dev){
        epson_ar_open(dev[0], 'serial', function(P){
            P.short_test(function(res) {
                P.get_status(function(res) {
                    console.log(res);
                    P.close(function(res){ console.log(res); });
                });
            });
        });
    });
}

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
