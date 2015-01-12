// Protocolo EPSON, common definitions

var epson_common = function(interface, sequence_start, sequence_size) {
	var STX = 0x02
	var ETX = 0x03
	var R01 = 0x1A
	var ESC = 0x1B
	var FLD = 0x1C
	var R02 = 0x1D
	var R03 = 0x1E
	var R04 = 0x1F
	var ToEscape = [ STX, ETX, R01, ESC, FLD, R02, R03, R04 ];
    var SymbolMap = { '<': STX, '>': ETX, '_': FLD, };

    this.interface=interface;
    this.sequence_start=sequence_start;
    this.sequence_size=sequence_size;
    this.ackbuf = new Uint8Array([0x06]);

	this.extend = function(destination, source) {
      var self = this;
	  for (var property in source) {
	      if (source.hasOwnProperty(property)) {
		  destination[property] = source[property];
	      }
	  }
	  return destination;
	};

	this.escape_counter = 0;

	this.bufEscape = function(inbuf) {
        var self = this;
	    var buf = new ArrayBuffer(inbuf.byteLength*2);
	    var bufView = new Uint8Array(buf);
	    var inbufView = new Uint8Array(inbuf);
	    var i = 0;
	    for (j in inbufView) {
		c = inbufView[j];
		if (ToEscape.indexOf(c) >= 0) {
		    bufView[i] = ESC;
		    i++;
		};
		bufView[i] = c;
		i++;
	    };
	    return buf.slice(0,i);
	};

	this.bufUnescape = function(inbuf) {
        var self = this;
	    var buf = new ArrayBuffer(inbuf.byteLength);
	    var bufView = new Uint8Array(buf);
	    var inbufView = new Uint8Array(inbuf);
	    var i = 0;
	    var s = false;
	    var stop_chars = false;

	    if (arguments.length == 2) {
		stop_chars = arguments[1];
	    }

	    self.escape_counter=0;

	    for (j in inbufView) {
		c = inbufView[j];
		if (!s && c == ESC) {
		    s = true;
		    self.escape_counter++;
		} else {
		    s = false;
		    if (stop_chars && stop_chars.indexOf(inbufView[j]) >= 0) {
			return buf.slice(0,i);
		    }
		    bufView[i] = inbufView[j];
		    i++;
		};
	    };
	    return buf.slice(0,i);
	};

	this.pack = function() {
        var self = this;
	    var types = arguments[0];
	    var fields = arguments;
	    var values = [];
	    var l = 0;
	    for (i=0, j=1; i < types.length; i++) {
		if (types[i] in SymbolMap) {
		    value = (new Uint8Array([SymbolMap[types[i]]])).buffer;
		} else
		if (['S'].indexOf(types[i]) >= 0) {
		    value = (new Uint8Array([self.sequence_start + (fields[j++] % self.sequence_size)])).buffer;
		} else
		if (['W'].indexOf(types[i]) >= 0) {
		    value = new ArrayBuffer(2);
		    vvalue = new DataView(value);
		    vvalue.setUint16(0, fields[j++], false);
		    value = self.bufEscape(value);
		} else
		if (['N'].indexOf(types[i]) >= 0) {
		    var integers = parseInt(types[++i],16);
		    var decimals = parseInt(types[++i],16);
		    var prevalue = pad(fields[j++].toFixed(decimals), integers + 1 + decimals, "0").split(".");
		    var value = null;
		    if (integers == 0) {
			value = str2ab(prevalue[1].substr(0,decimals))
		    } else if (decimals == 0) {
			value = str2ab(prevalue[0].substr(1,integers))
		    } else {
			value = str2ab(prevalue.join(""));
		    }
		    value = self.bufEscape(value);
		} else
		if (['A', 'L', 'B', 'P', 'H', 'R', 'Y', 'B', 'D', 'T'].indexOf(types[i]) >= 0) {
		    var value = null;
			 if (typeof fields[j] == 'number') { value = str2ab(fields[j++].toString()); }
		    else if (typeof fields[j] == 'string') { value = str2ab(fields[j++]); }
		    else                                   { value = fields[j++]; }
		    value = self.bufEscape(value);
		}
		if (types[i] == '*') {
		    l+=4;
		} else {
		    l+=value.byteLength;
		    values.push(value);
		}
	    };
	    var buf = new ArrayBuffer(l);
	    var vbuf = new Uint8Array(buf);
	    // Fill buffer.
	    for (var i=0, k=0; i < values.length; i++) {
		vval = new Uint8Array(values[i]);
		for (var j=0; j < vval.length; j++) {
		    vbuf[k++] = vval[j]
		}
	    }
	    // Checksum computation.
	    var cs = 0;
	    for (var i = 0; i < vbuf.length; i++) { cs = cs + vbuf[i]; };
	    cs = cs.toString(16);
	    for (var i = 0; i < 4; i++)
		if (i < 4 - cs.length) {
		    vbuf[k++] = '0'.charCodeAt(0);
		} else {
		    vbuf[k++] = cs.charCodeAt(i-4+cs.length);
		}
	    return buf;
	};

	this.unpack = function() {
        var self = this;
	    var types = arguments[0];
	    var fields = arguments[1];
	    var data = arguments[2];
	    var r = {};
	    var f = 0;
	    var l = 0;
	    var v = new DataView(data);
	    for (var i=0; i < types.length; i++) {
		if (['W'].indexOf(types[i]) >= 0) {
		    var nb = self.bufUnescape(data.slice(l, l+4));
		    var nv = new DataView(nb);
		    r[fields[f++]] = nv.getUint16(0, false);
		    l+=2+self.escape_counter;
		} else  
		if (['A','P','L','N','Y','R','D','T'].indexOf(types[i]) >= 0) {
		    var nb = self.bufUnescape(data.slice(l), [FLD,ETX]);
		    r[fields[f++]] = ab2str(nb);
		    l+=nb.byteLength+self.escape_counter;
		} else  
		if (['<'].indexOf(types[i]) >= 0) {
		    var d = v.getUint8(l++);
		} else
		if (['>'].indexOf(types[i]) >= 0) {
		    var d = v.getUint8(l++);
		} else
		if (['_'].indexOf(types[i]) >= 0) {
		    var d = v.getUint8(l++);
		} else
		if (['S'].indexOf(types[i]) >= 0) {
		    var d = v.getUint8(l++);
		} else {
		    console.debug('Type ', types[i], ' not implemented');
		}
	    }
	    return r;
	}

	this.unbits = function(masks, shifts, fields, data) {
        var self = this;
	    r = {};
	    for (var i = 0; i < masks.length; i++) {
		r[fields[i]] = (masks[i] & data) >> shifts[i];
	    }
	    return r;
	};

    this.sendACK = function(callback) {
        self = this;
        self.interface.send(self.ackbuf.buffer, function(info) { callback(info.resultCode == 0); });
    };

    this.waitResponse = function(types, fields, callback) {
        self = this;
        var local_callback = function(info) {
                if (info && info.resultCode == 0) {
                    var dv = new DataView(info.data);
                    if (info.data.byteLength==0) {
                        self.waitResponse(types, fields, callback);
                    } else 
                    if (info.data.byteLength==1 && dv.getUint8(0) == 0x15) {
                        console.error("USB-NACK");
                        self.sendACK(self.waitResponse.bind(self, types, fields, callback));
                        console.error("Recovering");
                        sequence = 0;
                        callback({'error': 'NACK'});
                    } else
                    if (info.data.byteLength==1 && dv.getUint8(0) == 0x06) {
                        self.sendACK(self.waitResponse.bind(self, types, fields, callback));
                    } else 
                    if (info.data.byteLength>1 && dv.getUint8(1) == 0x80) {
                        self.sendACK(function(res){
                            self.waitResponse(types, fields, callback);
                        });
                    } else
                    if (info.data.byteLength>1) {
                        self.sendACK(function(res){
                            callback(self.unpack(types, fields, info.data));
                        });
                    };
                } else {
                    callback();
                };
            };
        self.interface.receive(local_callback);
    };

    this.command = function(name, in_pack, out_types, out_dict, callback) {
        var self=this;
        var callback = callback;
        
        if (self.busy) {
            setTimeout(function() { 
                self.command(name, in_pack, out_types, out_dict, callback);
            }, 5);
            return;
        } else {
            self.busy++;
        }

        var local_callback = function(response) {
            self.busy--;
            callback(response);
        };
        self.interface.alive(
                function() {
                    var __callback__ = function(info) {
                        if (info && info.resultCode == 0) {
                            self.waitResponse(out_types, out_dict, local_callback);
                        } else {
                            local_callback();
                        }
                    };
                    self.interface.send(in_pack, __callback__);
                }, function() {
                    local_callback();
                });
    };



};
// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
