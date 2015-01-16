// Protocolo EPSON, common definitions

var epson_ar_common = function(interface, sequence_start, sequence_size){
  this.common = new epson_common(interface, sequence_start, sequence_size);

	this.result_messages = {
		0x0000:"Resultado exitoso",
		0x0001:"Error interno",
		0x0002:"Error de inicialización del equipo",
		0x0003:"Error de proceso interno",
		0x0101:"Comando inválido para el estado actual",
		0x0102:"Comando inválido para el documento actual",
		0x0103:"Comando sólo aceptado en modo técnico",
		0x0104:"Comando sólo aceptado sin Jumper de Servicio",
		0x0105:"Comando sólo aceptado con Jumper de Servicio",
		0x0106:"Comando sólo aceptado sin Jumper de Uso Interno",
		0x0107:"Comando sólo aceptado con Jumper de Uso Interno",
		0x0108:"Sub estado inválido",
		0x0109:"Límite de intervenciones técnicas alcanzado",
		0x0201:"El frame no contiene el largo mínimo aceptado",
		0x0202:"Comando inválido",
		0x0203:"Campos en exceso",
		0x0204:"Campos en defecto",
		0x0205:"Campo no opcional",
		0x0206:"Campo alfanumérico inválido",
		0x0207:"Campo alfabético inválido",
		0x0208:"Campo numérico inválido",
		0x0209:"Campo binario inválido",
		0x020A:"Campo imprimible inválido",
		0x020B:"Campo hexadecimal inválido",
		0x020C:"Campo fecha inválido",
		0x020D:"Campo hora inválido",
		0x020E:"Campo fiscal rich text inválido",
		0x020F:"Campo booleano inválido",
		0x0210:"Largo del campo inválido",
		0x0211:"Extensión del comando inválida",
		0x0212:"Código de barra no permitido",
		0x0213:"Atributos de impresión no permitidos",
		0x0214:"Atributo de impresión inválido",
		0x0215:"Código de barra incorrectamente definido",
		0x0216:"Combinación de la palabra ‘total’ no aceptada",
		0x0301:"Error de hardware",
		0x0302:"Impresora fuera de línea",
		0x0303:"Error de Impresión",
		0x0304:"Problemas de papel, no se encuentra en condiciones para realizar la acción requerida, verificar que si hay papel en rollo , slip o validación al mismo tiempo",
		0x0305:"Poco papel disponible",
		0x0306:"Error en carga o expulsión de papel",
		0x0307:"Característica de impresora no soportada",
		0x0308:"Error de display",
		0x0309:"Secuencia de scan inválida",
		0x030A:"Número de área de recorte (crop area) inválido",
		0x030B:"Scanner no preparado",
		0x030C:"Resolución de logotipo de la empresa no permitida",
		0x030D:"Imposible imprimir documento en estación térmica",
		0x0401:"Número de serie inválido",
		0x0402:"Deben configurarse los datos de fiscalización",
		0x0501:"Fecha / Hora no configurada",
		0x0502:"Error en cambio de fecha",
		0x0503:"Fecha fuera de rango",
		0x0505:"Número de caja inválido",
		0x0506:"CUIT inválido",
		0x0507:"Responsabilidad frente al IVA inválida",
		0x0508:"Número de línea de Encabezado/Cola inválido",
		0x0509:"Demasiadas fiscalizaciones",
		0x050A:"Demasiados cambios de situación tributaria",
		0x050B:"Demasiados cambios de datos de fiscalización",
		0x0513:"Logo de usuario inválido",
		0x0514:"Secuencia de definición de logos de usuario inválida",
		0x0515:"Configuración de Display inválida",
		0x0516:"Tipo de letra de MICR inválida",
		0x0518:"Líneas de establecimiento no configuradas",
		0x0519:"Datos fiscales no configurados",
		0x0520:"Situación tributaria no configurada",
		0x0521:"Tasa de IVA estándar no configurada",
		0x0522:"Límite de tique-factura no configurado",
		0x0524:"Monto máximo de tique-factura no permitido",
		0x0525:"Largo del logotipo de la empresa no permitido",
		0x0526:"Posición del logotipo de la empresa inválido",
		0x0527:"El tamaño del logotipo de la empresa excede el máximo",
		0x0801:"Comando inválido fuera de la jornada fiscal",
		0x0802:"Comando inválido dentro de la jornada fiscal",
		0x0803:"Memoria fiscal llena. Imposible la apertura de la jornada fiscal",
		0x0807:"Periodo auditado sin datos",
		0x0808:"Rango auditado inválido",
		0x0809:"Restan datos por auditar",
		0x080A:"No hay más datos a descargar",
		0x080B:"No es posible abrir la jornada fiscal",
		0x080C:"No es posible cerrar la jornada fiscal",
		0x0901:"Overflow",
		0x0902:"Underflow",
		0x0903:"Demasiados ítems involucrados en la transacción",
		0x0904:"Demasiadas tasas de impuesto utilizadas",
		0x0905:"Demasiados descuentos/recargos sobre subtotal involucradas en la transacción",
		0x0906:"Demasiados pagos involucrados en la transacción",
		0x0907:"Item no encontrado",
		0x0908:"Pago no encontrado",
		0x0909:"El total debe ser mayor a cero",
		0x090A:"Se permite sólo un tipo de impuestos internos",
		0x090B:"Impuesto interno no aceptado",
		0x090F:"Tasa de IVA no encontrada",
		0x0910:"Tasa de IVA inválida",
		0x0A01:"No permitido luego de descuentos/recargos sobre el subtotal",
		0x0A02:"No permitido luego de iniciar la fase de pago",
		0x0A03:"Tipo de ítem inválido",
		0x0A04:"Línea de descripción en blanco",
		0x0A05:"Cantidad resultante menor que cero",
		0x0A06:"Cantidad resultante mayor a lo permitido",
		0x0A07:"Precio total del ítem mayor al permitido",
		0x0A0A:"Fase de pago finalizada",
		0x0A0B:"Monto de pago no permitido",
		0x0A0C:"Monto de descuento/recargo no permitido",
		0x0A0F:"No permitido antes de un ítem",
		0x0A10:"Demasiadas descripciones extras",
		0x0B01:"Tipo de documento del comprador inválido",
		0x0B02:"Máximo valor aceptado fue superado",
		0x0B03:"CUIT/CUIL inválido",
		0x0B04:"Tipo de percepción inválida",
		0x0B05:"Exceso en la cantidad de líneas de separación de la firma",
		0x0B06:"Monto cero de percepción no permitido",
		0x0B07:"Demasiadas percepciones involucradas en la transacción",
		0x0B08:"Percepción no encontrada",
		0x0B09:"Operación no permitida luego de percepciones",
		0x0B0A:"Exceso de operaciones dentro del documento con triplicado",
		0x0B0B:"Tique factura del turista solo es aceptado en tique-factura B",
		0x0B0C:"Datos del turista inválidos",
		0x0B0D:"Número de documento inválido",
		0x0B0E:"Documento no soportado por el mecanismo de impresión",
		0x0E02:"Exceso de código de barras dentro del documento",
		0x0F02:"Falla en las condiciones del sector de DNFH Multicomando",
		0xFFFF:"Error desconocido",
	};

  this.fiscalState = function(data) {
    var self = this;
    return self.common.unbits([parseInt('1100000000000000',2),
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

	var strFunctionMode = [ 'Modo bloqueado', 'Modo manufactura', 'Modo entrenamiento', 'Modo fiscal' ];
	var strInTechMode = [ 'Modo tecnico inactivo', 'Modo activo' ];
	var strMemStatus = [ 'Memoria ok', 'Memoria casi llena', 'Memoria llena', 'Memoria dañada' ];
	var strInFiscalJournal = [ 'Jornada fiscal cerrada', 'Jornada fiscal abierta' ];
	var strSubStatus = [ 'Sin subestados', 'Puerto de auditoría seleccionada', 'Configuración de scanner',
                  'Configuración de logo', 'Auditoría en progreso' ];
	var strDocumentInProgress = [ 'Sin documentos en progresos', 'Tique en progreso', 'Tique factura en progreso',
			      'Tique nota de crédito en progreso', 'Tique nota de débito en progreso', 'Reservado',
			      'Documento de auditoría en progreso', 'DNFH de auditoría en progreso',
			      'Documento no fiscal en rollo', 'Documento no fiscal en slip' ];

	this.fiscalStateString = function(data) {
    var self = this;
    var s = self.fiscalState(data);
    return strFunctionMode[s.functionMode] + ',' +
	       strInTechMode[s.inTechMode] + ',' +
	       strMemStatus[s.memStatus] + ',' +
	       strInFiscalJournal[s.inFiscalJournal] + ',' +
	       strSubStatus[s.subStatus] + ',' +
	       strDocumentInProgress[s.documentInProgress]
	};

	this.printerState = function(data) {
    var self = this;
    return self.common.unbits([parseInt('1000000000000000',2),
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

	var strIsOffline = [ 'Online', 'Offline' ];
	var strInError = [ 'Sin error', 'Con error' ];
	var strIsPrinterOpen = [ 'Tapa cerrada', 'Tapa abierta' ];
	var strIsBoxOpen = [ 'Cajón cerrado', 'Cajón abierto' ];
	var strPrinterStation = [ 'Recibos', 'Hojas sueltas', 'Validación', 'MICR' ];
	var strSlipState = [ 'Slip Normal', 'Slip a espera de carga de papel', 'Slip a espera de remoción de papel' ]
	var strSlipInitHasPaper = [ 'Slip BOF Sin Papel', 'Slip BOF Con Papel' ];
	var strSlipEndHasPaper = [ 'Slip TOF Sin Papel', 'Slip TOF Con Papel' ];
	var strSlipHasPaper = [ 'Slip Sin Papel', 'Slip Con Papel' ];
	var strJournalState = [ 'Journal sin problemas', 'Journal con poco papel disponible', 'Journal sin papel no disponible' ];
	var strReceiptState = [ 'Recibo sin problemas', 'Recibo con poco papel disponible', 'Recibo sin papel no disponible' ];

	this.printerStateString = function(data) {
        var self = this;
        var s = self.printerState(data);
        return  strIsOffline[s.isOffline] + ',' +
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
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
