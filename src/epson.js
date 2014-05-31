function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var result_messages = {
	"0000":"Resultado exitoso",
	"0001":"Error interno",
	"0002":"Error de inicialización del equipo",
	"0003":"Error de proceso interno",
	"0101":"Comando inválido para el estado actual",
	"0102":"Comando inválido para el documento actual",
	"0103":"Comando sólo aceptado en modo técnico",
	"0104":"Comando sólo aceptado sin Jumper de Servicio",
	"0105":"Comando sólo aceptado con Jumper de Servicio",
	"0106":"Comando sólo aceptado sin Jumper de Uso Interno",
	"0107":"Comando sólo aceptado con Jumper de Uso Interno",
	"0108":"Sub estado inválido",
	"0109":"Límite de intervenciones técnicas alcanzado",
	"0201":"El frame no contiene el largo mínimo aceptado",
	"0202":"Comando inválido",
	"0203":"Campos en exceso",
	"0204":"Campos en defecto",
	"0205":"Campo no opcional",
	"0206":"Campo alfanumérico inválido",
	"0207":"Campo alfabético inválido",
	"0208":"Campo numérico inválido",
	"0209":"Campo binario inválido",
	"020A":"Campo imprimible inválido",
	"020B":"Campo hexadecimal inválido",
	"020C":"Campo fecha inválido",
	"020D":"Campo hora inválido",
	"020E":"Campo fiscal rich text inválido",
	"020F":"Campo booleano inválido",
	"0210":"Largo del campo inválido",
	"0211":"Extensión del comando inválida",
	"0212":"Código de barra no permitido",
	"0213":"Atributos de impresión no permitidos",
	"0214":"Atributo de impresión inválido",
	"0215":"Código de barra incorrectamente definido",
	"0216":"Combinación de la palabra ‘total’ no aceptada",
	"0301":"Error de hardware",
	"0302":"Impresora fuera de línea",
	"0303":"Error de Impresión",
	"0304":"Problemas de papel, no se encuentra en condiciones para realizar la acción requerida, verificar que si hay papel en rollo , slip o validación al mismo tiempo",
	"0305":"Poco papel disponible",
	"0306":"Error en carga o expulsión de papel",
	"0307":"Característica de impresora no soportada",
	"0308":"Error de display",
	"0309":"Secuencia de scan inválida",
	"030A":"Número de área de recorte (crop area) inválido",
	"030B":"Scanner no preparado",
	"030C":"Resolución de logotipo de la empresa no permitida",
	"030D":"Imposible imprimir documento en estación térmica",
	"0401":"Número de serie inválido",
	"0402":"Deben configurarse los datos de fiscalización",
	"0501":"Fecha / Hora no configurada",
	"0502":"Error en cambio de fecha",
	"0503":"Fecha fuera de rango",
	"0505":"Número de caja inválido",
	"0506":"CUIT inválido",
	"0507":"Responsabilidad frente al IVA inválida",
	"0508":"Número de línea de Encabezado/Cola inválido",
	"0509":"Demasiadas fiscalizaciones",
	"050A":"Demasiados cambios de situación tributaria",
	"050B":"Demasiados cambios de datos de fiscalización",
	"0513":"Logo de usuario inválido",
	"0514":"Secuencia de definición de logos de usuario inválida",
	"0515":"Configuración de Display inválida",
	"0516":"Tipo de letra de MICR inválida",
	"0518":"Líneas de establecimiento no configuradas",
	"0519":"Datos fiscales no configurados",
	"0520":"Situación tributaria no configurada",
	"0521":"Tasa de IVA estándar no configurada",
	"0522":"Límite de tique-factura no configurado",
	"0524":"Monto máximo de tique-factura no permitido",
	"0525":"Largo del logotipo de la empresa no permitido",
	"0526":"Posición del logotipo de la empresa inválido",
	"0527":"El tamaño del logotipo de la empresa excede el máximo",
	"0801":"Comando inválido fuera de la jornada fiscal",
	"0802":"Comando inválido dentro de la jornada fiscal",
	"0803":"Memoria fiscal llena. Imposible la apertura de la jornada fiscal",
	"0807":"Periodo auditado sin datos",
	"0808":"Rango auditado inválido",
	"0809":"Restan datos por auditar",
	"080A":"No hay más datos a descargar",
	"080B":"No es posible abrir la jornada fiscal",
	"080C":"No es posible cerrar la jornada fiscal",
	"0901":"Overflow",
	"0902":"Underflow",
	"0903":"Demasiados ítems involucrados en la transacción",
	"0904":"Demasiadas tasas de impuesto utilizadas",
	"0905":"Demasiados descuentos/recargos sobre subtotal involucradas en la transacción",
	"0906":"Demasiados pagos involucrados en la transacción",
	"0907":"Item no encontrado",
	"0908":"Pago no encontrado",
	"0909":"El total debe ser mayor a cero",
	"090A":"Se permite sólo un tipo de impuestos internos",
	"090B":"Impuesto interno no aceptado",
	"090F":"Tasa de IVA no encontrada",
	"0910":"Tasa de IVA inválida",
	"0A01":"No permitido luego de descuentos/recargos sobre el subtotal",
	"0A02":"No permitido luego de iniciar la fase de pago",
	"0A03":"Tipo de ítem inválido",
	"0A04":"Línea de descripción en blanco",
	"0A05":"Cantidad resultante menor que cero",
	"0A06":"Cantidad resultante mayor a lo permitido",
	"0A07":"Precio total del ítem mayor al permitido",
	"0A0A":"Fase de pago finalizada",
	"0A0B":"Monto de pago no permitido",
	"0A0C":"Monto de descuento/recargo no permitido",
	"0A0F":"No permitido antes de un ítem",
	"0A10":"Demasiadas descripciones extras",
	"0B01":"Tipo de documento del comprador inválido",
	"0B02":"Máximo valor aceptado fue superado",
	"0B03":"CUIT/CUIL inválido",
	"0B04":"Tipo de percepción inválida",
	"0B05":"Exceso en la cantidad de líneas de separación de la firma",
	"0B06":"Monto cero de percepción no permitido",
	"0B07":"Demasiadas percepciones involucradas en la transacción",
	"0B08":"Percepción no encontrada",
	"0B09":"Operación no permitida luego de percepciones",
	"0B0A":"Exceso de operaciones dentro del documento con triplicado",
	"0B0B":"Tique factura del turista solo es aceptado en tique-factura B",
	"0B0C":"Datos del turista inválidos",
	"0B0D":"Número de documento inválido",
	"0B0E":"Documento no soportado por el mecanismo de impresión",
	"0E02":"Exceso de código de barras dentro del documento",
	"0F02":"Falla en las condiciones del sector de DNFH Multicomando",
	"FFFF":"Error desconocido",
};

var STX = 0x02
var ETX = 0x03
var R01 = 0x1A
var ESC = 0x1B
var FLD = 0x1C
var R02 = 0x1D
var R03 = 0x1E
var R04 = 0x1F

ToEscape = [ STX, ETX, R01, ESC, FLD, R02, R03, R04 ];

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

extend = function(destination, source) {
  for (var property in source) {
      if (source.hasOwnProperty(property)) {
          destination[property] = source[property];
      }
  }
  return destination;
};

var escape_counter = 0;

function bufEscape(inbuf) {
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

function bufUnescape(inbuf) {
    var buf = new ArrayBuffer(inbuf.byteLength);
    var bufView = new Uint8Array(buf);
    var inbufView = new Uint8Array(inbuf);
    var i = 0;
    var s = false;
    var stop_chars = false;

    if (arguments.length == 2) {
        stop_chars = arguments[1];
    }

    escape_counter=0;

    for (j in inbufView) {
        c = inbufView[j];
        if (!s && c == ESC) {
            s = true;
            escape_counter++;
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

function pack() {
    var types = arguments[0];
    var fields = arguments;
    var values = [];
    var l = 0;
    var SymbolMap = {
        '<': STX,
        '>': ETX,
        '_': FLD,
    };
    for (i=0, j=1; i < types.length; i++) {
        if (types[i] in SymbolMap) {
            value = (new Uint8Array([SymbolMap[types[i]]])).buffer;
        } else
        if (['S'].indexOf(types[i]) >= 0) {
            value = (new Uint8Array([0x81 + fields[j++]])).buffer;
        } else
        if (['W'].indexOf(types[i]) >= 0) {
            value = new ArrayBuffer(2);
            vvalue = new DataView(value);
            vvalue.setUint16(0, fields[j++], false);
            value = bufEscape(value);
        } else
        if (['A', 'L', 'N', 'B', 'P', 'H', 'R', 'Y', 'B', 'D', 'T'].indexOf(types[i]) >= 0) {
            var value = null;
                 if (typeof fields[j] == 'number') { value = str2ab(fields[j++].toString()); }
            else if (typeof fields[j] == 'string') { value = str2ab(fields[j++]); }
            else                                   { value = fields[j++]; }
            value = bufEscape(value);
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

function unpack() {
    var types = arguments[0];
    var fields = arguments[1];
    var data = arguments[2];
    var r = {};
    var f = 0;
    var l = 0;
    var v = new DataView(data);
    for (var i=0; i < types.length; i++) {
        if (['W'].indexOf(types[i]) >= 0) {
            var nb = bufUnescape(data.slice(l, l+4));
            var nv = new DataView(nb);
            r[fields[f++]] = nv.getUint16(0, false);
            l+=2+escape_counter;
        } else  
        if (['A','P','L','N','Y','R','D','T'].indexOf(types[i]) >= 0) {
            var nb = bufUnescape(data.slice(l), [FLD,ETX]);
            r[fields[f++]] = ab2str(nb);
            l+=nb.byteLength+escape_counter;
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

function unbits(masks, shifts, fields, data) {
    r = {};
    for (var i = 0; i < masks.length; i++) {
        r[fields[i]] = (masks[i] & data) >> shifts[i];
    }
    return r;
};

var fiscalState = function(data) {
    return unbits([parseInt('1100000000000000',2), 
                   parseInt('0001000000000000',2),
                   parseInt('0000110000000000',2),
                   parseInt('0000000010000000',2),
                   parseInt('0000000001110000',2),
                   parseInt('0000000000001111',2)],
                  [14,12,10,7,4,0],
                  ['functionMode', 'inTechMode', 'memStatus',
                   'inFiscalJournal', 'subStatus', 'documentInProgress'],
                  data);
};

strFunctionMode = [ 'Modo bloqueado', 'Modo manufactura', 'Modo entrenamiento', 'Modo fiscal' ];
strInTechMode = [ 'Modo tecnico inactivo', 'Modo activo' ];
strMemStatus = [ 'Memoria ok', 'Memoria casi llena', 'Memoria llena', 'Memoria dañada' ];
strInFiscalJournal = [ 'Jornada fiscal cerrada', 'Jornada fiscal abierta' ];
strSubStatus = [ 'Sin subestados', 'Puerto de auditoría seleccionada',
             'Configuración de scanner', 'Configuración de logo', 'Auditoría en progreso' ];
strDocumentInProgress = [ 'Sin documentos en progresos', 'Tique en progreso', 'Tique factura en progreso',
                      'Tique nota de crédito en progreso', 'Tique nota de débito en progreso', 'Reservado',
                      'Documento de auditoría en progreso', 'DNFH de auditoría en progreso',
                      'Documento no fiscal en rollo', 'Documento no fiscal en slip' ];


var fiscalStateString = function(data) {
    var s = fiscalState(data);
    return strFunctionMode[s.functionMode] + ',' +
        strInTechMode[s.inTechMode] + ',' +
        strMemStatus[s.memStatus] + ',' +
        strInFiscalJournal[s.inFiscalJournal] + ',' +
        strSubStatus[s.subStatus] + ',' +
        strDocumentInProgress[s.documentInProgress]
};

var printerState = function(data) {
    return unbits([parseInt('1000000000000000',2), 
                   parseInt('0100000000000000',2), 
                   parseInt('0010000000000000',2), 
                   parseInt('0001000000000000',2),
                   parseInt('0000011000000000',2),
                   parseInt('0000000110000000',2),
                   parseInt('0000000001000000',2),
                   parseInt('0000000000100000',2),
                   parseInt('0000000000010000',2),
                   parseInt('0000000000001100',2),
                   parseInt('0000000000000011',2)],
                  [15,14,13,12,9,7,6,5,4,2,0],
                  ['isOffline', 'inError', 'isPrinterOpen', 'isBoxOpen', 'printerStation',
                   'slipState', 'slipInitHasPaper', 'slipEndHasPaper', 'slipHasPaper',
                   'journalState', 'receiptState'],
                  data);
};

strIsOffline = [ 'Online', 'Offline' ];
strInError = [ 'Sin error', 'Con error' ];
strIsPrinterOpen = [ 'Tapa cerrada', 'Tapa abierta' ];
strIsBoxOpen = [ 'Cajón cerrado', 'Cajón abierto' ];
strPrinterStation = [ 'Recibos', 'Hojas sueltas', 'Validación', 'MICR' ];
strSlipState = [ 'Slip Normal', 'Slip a espera de carga de papel', 'Slip a espera de remoción de papel' ]
strSlipInitHasPaper = [ 'Slip BOF Sin Papel', 'Slip BOF Con Papel' ];
strSlipEndHasPaper = [ 'Slip TOF Sin Papel', 'Slip TOF Con Papel' ];
strSlipHasPaper = [ 'Slip Sin Papel', 'Slip Con Papel' ];
strJournalState = [ 'Journal sin problemas', 'Journal con poco papel disponible', 'Journal sin papel no disponible' ];
strReceiptState = [ 'Recibo sin problemas', 'Recibo con poco papel disponible', 'Recibo sin papel no disponible' ];

var printerStateString = function(data) {
    var s = printerState(data);
    return strIsOffline[s.isOffline] + ',' +
        strInError[s.inError] + ',' +
        strIsPrinterOpen[s.isPrinterOpen] + ',' +
        strIsBoxOpen[s.isBoxOpen] + ',' +
        strPrinterStation[s.printerStation] + ',' +
        strSlipState[s.slipState] + ',' +
        strSlipInitHasPaper[s.slipInitHasPaper] + ',' +
        strSlipEndHasPaper[s.slipEndHasPaper] + ',' +
        strSlipHasPaper[s.slipHasPaper] + ',' +
        strJournalState[s.journalState] + ',' +
        strReceiptState[s.receiptState]
};

var epson = function(device) {
    var sequence = 0;
    var self = this;

    this.protocol = 'epson';
    this.device = device;

    this.sendACK = function(callback) {
        var buf = new Uint8Array([0x06]);
        chrome.usb.bulkTransfer(self.device,
            {   'direction': 'out',
                'endpoint': 0x01,
                'data': buf.buffer, 
            }, function(info) {
                callback(info.resultCode == 0);
            });
    };

    this.waitResponse = function(types, fields, callback) {
        var local_callback = function(info) {
                if (info && info.resultCode == 0) {
                    if (info.data.byteLength==0) {
                        self.waitResponse(types, fields, callback);
                    } else 
                    if (info.data.byteLength==1 && (new Uint8Array(info.data))[0] == 0x15) {
                        console.error("USB-NACK");
                        console.error("Recovering");
                        self.sendACK(self.waitResponse.bind(self, types, fields, callback));
                        sequence = 0;
                    } else
                    if (info.data.byteLength==1 && (new Uint8Array(info.data))[0] == 0x06) {
                        self.sendACK(self.waitResponse.bind(self, types, fields, callback));
                    } else 
                    if (info.data.byteLength>1 && (new Uint8Array(info.data))[1] == 0x80) {
                        self.waitResponse(types, fields, callback);
                    } else
                    if (info.data.byteLength>1) {
                        callback(unpack(types, fields, info.data));
                    };
                };
            };
        chrome.usb.bulkTransfer(self.device,
            {   'direction': 'in',
                'endpoint': 0x82,
                'length': 2048
            }, local_callback);
    };

    this.close = function(callback) {
        var closed = function() {
            console.debug("EPSON: Device closed");
            callback();
        };
        chrome.usb.releaseInterface(self.device, 1, function() {
            chrome.usb.closeDevice(self.device, closed);
        });
    };

    // Values | Enums
    this.speed = {
        's38400bps'  : 0,
        's19200bps'  : 1,
        's9600bps'   : 2,
        's57600bps'  : 3,
        's115200bps' : 4 
    };

    this.station = {
        'rollo' : 0,
        'slip'  : 1,
    };

    this.alive = function(true_callback, false_callback) {
        chrome.usb.listInterfaces(self.device, function(res) { // Check if device still alive.
            if(res != null) { true_callback() } else { false_callback(); };
        });
    };

    this.command = function(name, in_pack, out_types, out_dict, callback) {
        var self=this;
        console.debug("EPSON:command:", name);
        var local_callback = function(response) {
            if (response && response.printerStatus != null) { 
                extend(response, printerState(response.printerStatus));
                response.strPrinterStatus = printerStateString(response.printerStatus);
            };
            if (response && response.fiscalStatus != null) {
                extend(response, fiscalState(response.fiscalStatus));
                response.strFiscalStatus = fiscalStateString(response.fiscalStatus);
            };
            if (response && response.result) {
                response.strResult = result_messages[pad(response.result.toString(16), 4)];
            };
            callback(response);
        };
        this.alive(function() {
            chrome.usb.bulkTransfer(self.device, // Send command.
                {   'direction': 'out',
                    'endpoint': 0x01,
                    'data': in_pack
                }, function(info) {
                    if (info && info.resultCode == 0)
                        self.waitResponse(out_types, out_dict, local_callback);
                    else
                        local_callback(null);
                });
            }, function() {
                local_callback(null);
            });
    };

    // 6.1.1 Obtener Estado (00 01)
    this._get_status = function(callback) {
       self.command(
                'get_status',
                pack("<SW_W>*", sequence++, 0x0001, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.1.2 Obtener Error de Inicio (00 03)
    this.get_init_error = function(callback) {
        self.command(
                'get_init_error',
                pack("<SW_W>*", sequence++, 0x0003, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };
    
    // 6.1.3 Obtener Error de Proceso Interno (00 04)
    this.get_internal_error = function(callback) {
        self.command(
                'get_internal_error',
                pack("<SW_W>*", sequence++, 0x0004, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.1.4 Obtener ID (00 05)
    this.get_id = function(callback) {
        self.command(
                'get_id',
                pack("<SW_W>*", sequence++, 0x0005, 0x0000),
                '<SW_W__W__P_A_L_P_N_N_N_N_N_N_Y_Y_Y_N_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                'model', 'serialNumber', 'firmwareName', 'firmwareVersion',
                'POS', 'width10cpi', 'width12cpi', 'width17cpi', 'widthCols',
                'lines', 'isTique', 'isTiqueFactura', 'isFactura',
                'digits', 'selected'],
                callback);
    };

    // 6.1.5 Configurar Velocidad de Comunicación (Host Port) (00 0A)
    this.set_com_speed = function(speed, callback) {
        self.command(
                'set_com_speed',
                pack("<SW_W>*", sequence++, 0x0005, speed),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.2.1 Reporte de Diagnóstico e Información del Equipo (02 01)
    this._print_diag_report = function(station, callback) {
        self.command(
                '_print_diag_report',
                pack("<SW_W>*", sequence++, 0x0201, station),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.2.2 Ripple Test (02 04)
    this._ripple_test = function(station, no_lines, callback) {
        self.command(
                '_ripple_test',
                pack("<SW_W_N>*", sequence++, 0x0204, station, no_lines),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.2.3 Obtener Información del Equipo (02 0A)
    this.print_fiscal_report = function(print, callback) {
        self.command(
                'print_fiscal_report',
                pack("<SW_W>*", sequence++, 0x020A, print && 1),
                '<SW_W__W__A_N_N_N_N_N_P_N_N_N_Y_B>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'versionName', 'idCountry',
                 'mayorVersion', 'menorVersion', 'compVersion',
                 'printerId', 'printerName',
                 'fiscalMemory', 'transactionMemory', 'workMemory',
                 'jumperConnected', 'jumperState'
                ], callback);
    };

    // 6.2.4 Tique Técnico (02 10)
    this._print_technical_ticket = function(callback) {
        self.command(
                '_print_technical_ticket',
                pack("<SW_W>*", sequence++, 0x0210, 0),
                '<SW_W__W__N_N_N_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'ticketNumber', 'totalAmount',
                 'vatAmount', 'returnAmount'
                ], callback);
    };
    
    // 6.3.1 Configurar Fecha y Hora (05 01)
    this._set_datetime = function(date, time, callback) {
        self.command(
                'set_datetime',
                pack("<SW_W_D_T>*", sequence++, 0x0501, 0, date, time),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result',
                ], callback);
    };

    // 6.3.2 Obtener Configuración de Fecha y Hora (05 02)
    this.get_datetime = function(callback) {
        self.command(
                'get_datetime',
                pack("<SW_W>*", sequence++, 0x0502, 0),
                '<SW_W__W__N_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'date', 'time',
                ], callback);
    };

    // 6.3.3 Obtener Datos de Fiscalización (05 07)
    this.get_fiscal_data = function(print, callback) {
        self.command(
                'get_fiscal_data',
                pack("<SW_W>*", sequence++, 0x0507, print && 1),
                '<SW_W__W__P_N_N_L_R_N_A_A_R_A_N_N_N_D_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'razonSocial', 'cuit', 'caja', 'ivaResposabilidad',
                 'calle', 'numero', 'piso', 'depto', 'localidad', 'cpa', 'provincia',
                 'tasaIVA', 'maxMonto', 'fechaFiscalizacion', 'cambiosResponsablesDisponibles'
                ], callback);
    };

    // 6.3.4 Configurar Líneas de Encabezado (05 08)
    this.set_header_lines = function(lineno, text, callback) {
        self.command(
                'set_header_lines',
                pack("<SW_W_N_R>*", sequence++, 0x0508, 0x0000, lineno, text),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.3.5 Obtener Configuración de Líneas de Encabezado (05 09)
    this.get_header_lines = function(lineno, callback) {
        self.command(
                'get_header_lines',
                pack("<SW_W_N>*", sequence++, 0x0509, 0x0000, lineno),
                '<SW_W__W__R>*',
                ['printerStatus', 'fiscalStatus', 'result', 'text'],
                callback);
    };

    // 6.3.6 Configurar Líneas de Cola (05 0A)
    this.set_footer_lines = function(lineno, text, callback) {
        self.command(
                'set_footer_lines',
                pack("<SW_W_N_R>*", sequence++, 0x050A, 0x0000, lineno, text),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.3.7 Obtener Configuración de Líneas de Cola (05 0B)
    this.get_footer_lines = function(lineno, callback) {
        self.command(
                'get_footer_lines',
                pack("<SW_W_N>*", sequence++, 0x050B, 0x0000, lineno),
                '<SW_W__W__R>*',
                ['printerStatus', 'fiscalStatus', 'result', 'text'],
                callback);
    };

    // 6.3.8 Configurar Líneas de Información del Establecimiento (05 0E)
    this.set_pos_info = function(line, value, callback) {
        self.command(
                'set_pos_info',
                pack("<SW_W_R>*", sequence++, 0x050E, line, value),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };
    
    // 6.3.9 Obtener Líneas de Información del Establecimiento (05 0F)
    this.get_pos_info = function(line, value, callback) {
        self.command(
                'get_pos_info',
                pack("<SW_W_R>*", sequence++, 0x050F, line),
                '<SW_W__W__R>*',
                ['printerStatus', 'fiscalStatus', 'result', 'value'],
                callback);
    };

    // 6.3.10 Iniciar Carga de Logo de Usuario (05 30)
    this.init_load_logo = function(width, height, quantity, callback) {
        self.command(
                'init_load_logo',
                pack("<SW_W_W_W_N>*", sequence++, 0x0530, 0x0000,
                    width, height, quantity),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.3.11 Enviar Datos de Logo del Usuario (05 31)
    this.load_logo = function(bitmap, callback) {
        self.command(
                'logo_load',
                pack("<SW_W_B>*", sequence++, 0x0531, 0x0000,
                    bitmap),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.3.12 Terminar Carga de Logo del Usuario (05 32)
    this.finish_load_logo = function(bitmap, callback) {
        self.command(
                'finish_logo_load',
                pack("<SW_W>*", sequence++, 0x0532, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.3.13 Cancelar Carga de Logo del Usuario (05 33)
    this.finish_load_logo = function(bitmap, callback) {
        self.command(
                'finish_logo_load',
                pack("<SW_W>*", sequence++, 0x0533, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.3.14 Eliminar Logo del Usuario (05 34)
    this.delete_logo = function(bitmap, callback) {
        self.command(
                'delete_logo',
                pack("<SW_W>*", sequence++, 0x0534, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.3.15 Configurar Monto Máximo de Tique-Factura / Nota de Crédito (05 40)
    this.set_max_amount = function(amount, callback) {
        self.command(
                'set_max_amount',
                pack("<SW_W_N>*", sequence++, 0x0540, 0x0000,
                    amount),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };

    // 6.3.16 Impresión de arqueo de pagos (05 52)
    this.set_payment_report = function(active, callback) {
        self.command(
                'set_payment_report',
                pack("<SW_W>*", sequence++, 0x0552, active && 1),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    };
    
    // 6.3.17 Obtener estado de impresión de arqueo de pagos (05 53)
    this.get_payment_report = function(active, callback) {
        self.command(
                'get_payment_report',
                pack("<SW_W>*", sequence++, 0x0553, 0x0000),
                '<SW_W__W__N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'active'],
                callback);
    };

    // 6.4.1 Avanzar Papel (07 01)
    this._advance_paper = function(station, lines, callback) {
        self.command(
                'advance_paper',
                pack("<SW_W_N>*", sequence++, 0x0701, station & 0x0003, lines),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    }
    
    // 6.4.2 Cortar Papel (07 02)
    this._cut_paper = function(callback) {
        self.command(
                'cut_paper',
                pack("<SW_W>*", sequence++, 0x0702, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                callback);
    }

    // 6.5.1 Reporte Z (08 01)
    this._z_report = function(showheadfoot, showinfo, callback) {
        var ext = (showinfo && 0x0800) + (showheadfoot && 0x0400);
        self.command(
                'z_report',
                pack("<SW_W>*", sequence++, 0x0801, 0x0C00),
                '<SW_W__W__W>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'closeNumber'],
                callback);
    }
    
    // 6.5.2 Reporte X (08 02)
    this._x_report = function(showheadfoot, showinfo, print, callback) {
        var ext = (showinfo && 0x0800) + (showheadfoot && 0x0400) + (print && 0x0001);
        self.command(
                'x_report',
                pack("<SW_W>*", sequence++, 0x0802, ext),
                '<SW_W__W__W>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'closeNumber'],
                callback);
    }

    // 6.5.4 Información Electrónica General de la Jornada Fiscal en Curso (08 0A)
    this._get_fiscal_information = function(from_last_x, callback) {
        var ext = (from_last_x && 0x0001);
        self.command(
                'get_fiscal_information',
                pack("<SW_W>*", sequence++, 0x080A, ext),
                '<SW_W__W__D_T_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_Y>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'date_open_fiscal_journal', // 1
                 'time_open_fiscal_journal', // 2
                 'last_z_report',
                 'last_a_sale_document',
                 'last_b_sale_document',     // 5
                 'last_a_credit_document',
                 'last_b_credit_document',
                 'last_fiscal_document',
                 'last_fiscal_homo_document',
                 'total_sale',               // 10
                 'total_vat',
                 'total_fixed_tax',
                 'total_rated_tax',
                 'total_perceptions',
                 'total_credit_document',    // 15
                 'total_vat_credit_document',
                 'total_fixed_tax_credit_document',
                 'total_rated_tax_credit_document',
                 'total_perceptions_credit_document',
                 'number_of_df',             // 20
                 'number_of_dnf',
                 'number_of_dnfh',
                 'number_of_a_sale_document',
                 'number_of_a_sale_document_cancelled',
                 'number_of_b_sale_document',// 25
                 'number_of_b_sale_document_cancelled',
                 'number_of_credit_document',
                 'number_of_a_credit_document',
                 'number_of_b_credit_document',
                 'need_close_journal',       // 30
                 ],
                callback);
    }

    //
    // Wrapper fields
    //
    this.read_operation = {
        'date':         function(callback){ self.get_datetime(function(response) { callback(response && response.date); }); },
        'time':         function(callback){ self.get_datetime(function(response) { callback(response && response.time); }); },
        'headerLine 1': function(callback){ self.get_header_lines(1, function(response) { callback(response && response.text); }); },
        'headerLine 2': function(callback){ self.get_header_lines(2, function(response) { callback(response && response.text); }); },
        'headerLine 3': function(callback){ self.get_header_lines(3, function(response) { callback(response && response.text); }); },
        'headerLine 4': function(callback){ self.get_header_lines(4, function(response) { callback(response && response.text); }); },
        'headerLine 5': function(callback){ self.get_header_lines(5, function(response) { callback(response && response.text); }); },
        'headerLine 6': function(callback){ self.get_header_lines(6, function(response) { callback(response && response.text); }); },
        'headerLine 7': function(callback){ self.get_header_lines(7, function(response) { callback(response && response.text); }); },

        'razonSocial' : function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.razonSocial); }); },
        'cuit' :        function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.cuit); }); },
        'caja' :        function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.caja); }); },
        'ivaResponsabilidad' : function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.ivaResponsabilidad); }); },
        'calle' :       function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.calle); }); },
        'numero' :      function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.numero); }); },
        'piso' :        function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.piso); }); },
        'depto' :       function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.depto); }); },
        'localidad' :   function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.localidad); }); },
        'cpa' :         function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.cpa); }); },
        'provincia' :   function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.provincia); }); },
        'tasaIVA':      function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.tasaIVA); }); },
        'maxMonto':     function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.maxMonto); }); },
        'fechaFiscalizacion': function(callback){ self.get_fiscal_data (0, function(response) { callback(response && response.fechaFiscalizacion); }); },

        'footerLine 1': function(callback){ self.get_footer_lines(1, function(response) { callback(response && response.text); }); },
        'footerLine 2': function(callback){ self.get_footer_lines(2, function(response) { callback(response && response.text); }); },
        'footerLine 3': function(callback){ self.get_footer_lines(3, function(response) { callback(response && response.text); }); },
        'footerLine 4': function(callback){ self.get_footer_lines(4, function(response) { callback(response && response.text); }); },
        'footerLine 5': function(callback){ self.get_footer_lines(5, function(response) { callback(response && response.text); }); },
        'footerLine 6': function(callback){ self.get_footer_lines(6, function(response) { callback(response && response.text); }); },
        'footerLine 7': function(callback){ self.get_footer_lines(7, function(response) { callback(response && response.text); }); },
    };

    this.write_operation = {
        'date':         function(value_, callback){
            self.get_datetime(function(response) {
                var date = value_,
                    time = response.time;
                    self.set_datetime(date, time, function(response) { callback(response); });
            });
        },
        'time':         function(value_, callback){
            self.get_datetime(function(response) {
                var date = response.date,
                    time = value_;
                    self.set_datetime(date, time, function(response) { callback(response); });
            });
        },
        'headerLine 1': function(value_, callback){ self.set_header_lines(1, value_, function(response) { callback(response); }); },
        'headerLine 2': function(value_, callback){ self.set_header_lines(2, value_, function(response) { callback(response); }); },
        'headerLine 3': function(value_, callback){ self.set_header_lines(3, value_, function(response) { callback(response); }); },
        'headerLine 4': function(value_, callback){ self.set_header_lines(4, value_, function(response) { callback(response); }); },
        'headerLine 5': function(value_, callback){ self.set_header_lines(5, value_, function(response) { callback(response); }); },
        'headerLine 6': function(value_, callback){ self.set_header_lines(6, value_, function(response) { callback(response); }); },
        'headerLine 7': function(value_, callback){ self.set_header_lines(7, value_, function(response) { callback(response); }); },
        'footerLine 1': function(value_, callback){ self.set_footer_lines(1, value_, function(response) { callback(response); }); },
        'footerLine 2': function(value_, callback){ self.set_footer_lines(2, value_, function(response) { callback(response); }); },
        'footerLine 3': function(value_, callback){ self.set_footer_lines(3, value_, function(response) { callback(response); }); },
        'footerLine 4': function(value_, callback){ self.set_footer_lines(4, value_, function(response) { callback(response); }); },
        'footerLine 5': function(value_, callback){ self.set_footer_lines(5, value_, function(response) { callback(response); }); },
        'footerLine 6': function(value_, callback){ self.set_footer_lines(6, value_, function(response) { callback(response); }); },
        'footerLine 7': function(value_, callback){ self.set_footer_lines(7, value_, function(response) { callback(response); }); },
    };

    //
    // Common API functions
    //

    // API: Read printer fields
    this.read_field = function(field, callback) {
        if (field in this.read_operation) {
            this.read_operation[field](callback);
        } else {
            callback('[field not found]');
        };
    };

    // API: Write printer fields
    this.write_field = function(field, value_, callback) {
        if (field in this.write_operation) {
            this.write_operation[field](value_, callback);
        } else {
            callback();
        };
    };
    
    // API: OPERATION (?)
    this.read_attributes = function(callback) {
        var self = this;
        var f = [];
        var fields = {};
        var readonly = [];
        var attributes = {};

        var read_fields = function(ks) {
            var field = ks.pop();
            if (!(field in self.write_operation)) {
                readonly.push(field);
            }
            if (field) {
                self.read_operation[field](function(r) {
                    attributes[field] = r;
                    read_fields(ks);
                });
            } else {
                self.get_datetime(function(response) {
                    var date = response.date;
                    var time = response.time;
                    fields['clock'] = "20"+date.slice(4,6)+"-"+date.slice(2,4)+"-"+date.slice(0,2)+" "+time.slice(0,2)+":"+time.slice(2,4)+":"+time.slice(4,6);
                    fields['printerStatus'] = 'Impresora: ' + response.strPrinterStatus + '\nFiscal: ' + response.strFiscalStatus;
                    callback({fields: fields, attributes: attributes, readonly: readonly});
                });
            };
        };

        for (var k in this.read_operation) {
            f.push(k);
        };
        read_fields(f);
    };

    // Status
    this.get_status = function(callback) {
        var self = this;
        self._get_status(function(res) {
            callback(res);
        });
    };

    // Tests

    // API: Execute short test
    this.short_test = function(callback) {
        var self = this;
        self._ripple_test(0, 10, function() {
            callback();
        });
    };

    // API: Execute large test
    this.large_test = function(callback) {
        var self = this;
        self._print_diag_report(0, function() {
            self._ripple_test(0, 10, function() {
                self._print_technical_ticket(function() {
                    callback();
                });
            });
        });
    };

    // Paper Control

    // API: Advance paper
    this.advance_paper = function(lines, callback) {
        var self = this;
        self._advance_paper(0,1,callback);
    }
    
    // API: Cut paper
    this.cut_paper = function(callback) {
        var self = this;
        self._cut_paper(callback);
    }

    // API: Cancel printer
    
    // Document information

    // Fiscal Journal
    
    // API: Open Fiscal Journal
    this.open_fiscal_journal = function(callback) {
        var self = this;
        var d = new Date();
        var date = [ pad(d.getDate(), 2), pad(d.getMonth()+1, 2), pad(d.getFullYear().toString().substr(2,2), 2) ].join('')
        var time =  [ pad(d.getHours(), 2), pad(d.getMinutes(), 2), pad(d.getSeconds(), 2) ].join('')
        self._set_datetime(date, time, callback);
    }

    // API: Close Fiscal Journal (Z Report)
    this.close_fiscal_journal = function(callback) {
        var self = this;
        self._z_report(1,1,callback);
    }

    // API: Shift Change (X Report)
    this.shift_change = function(callback) {
        var self = this;
        self._x_report(1,1,1,callback);
    }

    // API: Generate ticket.
};

function epson_open(device, callback) {
    console.debug("EPSON: Constructor");
    chrome.usb.claimInterface(device, 0, function() {
        chrome.usb.claimInterface(device, 1, function() {
            console.debug("EPSON: Device claimed");
            callback(new epson(device));
        });
    });
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
