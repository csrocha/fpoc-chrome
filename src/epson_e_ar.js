// Protocolo EPSON, Revision E (01/10/2012)

var epson_e_ar = function(interface, sequence) {
    var self = this;
    var sequence = typeof sequence !== 'undefined' ? sequence : 0;

    this.interface = interface;
    this.ar = new epson_ar_common(interface, 0x81,0x7f);
    this.ackbuf = new Uint8Array([0x06]);
    this.common = this.ar.common;
    this.protocol = 'epson_e_ar';

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

    this.command_callback = function(callback) {
        var self = this;
        return function(response) {
            response = response || {};
            if (response && response.printerStatus != null) {
                self.common.extend(response, self.ar.printerState(response.printerStatus));
                response.strPrinterStatus = self.ar.printerStateString(response.printerStatus);
            };
            if (response && response.fiscalStatus != null) {
                self.common.extend(response, self.ar.fiscalState(response.fiscalStatus));
                response.strFiscalStatus = self.ar.fiscalStateString(response.fiscalStatus);
            };
            if (response && response.result) {
                response.strResult = self.ar.result_messages[response.result];
            };
            callback(response);
        }
    };

    this.close = function(callback) {
        self.interface.close(function() {
            console.debug("EPSON: Device closed");
            if (callback) callback();
        });
    };

    // 6.1.1 Obtener Estado (00 01)
    this._get_status = function(callback) {
       var self = this;
       self.common.command(
                'get_status',
                self.common.pack("<SW_W>*", sequence++, 0x0001, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.1.2 Obtener Error de Inicio (00 03)
    this.get_init_error = function(callback) {
        self.common.command(
                'get_init_error',
                self.common.pack("<SW_W>*", sequence++, 0x0003, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.1.3 Obtener Error de Proceso Interno (00 04)
    this.get_internal_error = function(callback) {
        self.common.command(
                'get_internal_error',
                self.common.pack("<SW_W>*", sequence++, 0x0004, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.1.4 Obtener ID (00 05)
    this._get_id = function(callback) {
        self.common.command(
                'get_id',
                self.common.pack("<SW_W>*", sequence++, 0x0005, 0x0000),
                '<SW_W__W__P_A_L_P_N_N_N_N_N_N_Y_Y_Y_N_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                'model', 'serialNumber', 'firmwareName', 'firmwareVersion',
                'POS', 'width10cpi', 'width12cpi', 'width17cpi', 'widthCols',
                'lines', 'isTique', 'isTiqueFactura', 'isFactura',
                'digits', 'selected'],
                self.command_callback(callback));
    };

    // 6.1.5 Configurar Velocidad de Comunicación (Host Port) (00 0A)
    this.set_com_speed = function(speed, callback) {
        self.common.command(
                'set_com_speed',
                self.common.pack("<SW_W>*", sequence++, 0x0005, speed),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.2.1 Reporte de Diagnóstico e Información del Equipo (02 01)
    this._print_diag_report = function(station, callback) {
        self.common.command(
                '_print_diag_report',
                self.common.pack("<SW_W>*", sequence++, 0x0201, station),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.2.2 Ripple Test (02 04)
    this._ripple_test = function(station, no_lines, callback) {
        self.common.command(
                '_ripple_test',
                self.common.pack("<SW_W_N30>*", sequence++, 0x0204, station, no_lines),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.2.3 Obtener Información del Equipo (02 0A)
    this.print_fiscal_report = function(print, callback) {
        self.common.command(
                'print_fiscal_report',
                self.common.pack("<SW_W>*", sequence++, 0x020A, print && 1),
                '<SW_W__W__A_N_N_N_N_N_P_N_N_N_Y_B>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'versionName', 'idCountry',
                 'mayorVersion', 'menorVersion', 'compVersion',
                 'printerId', 'printerName',
                 'fiscalMemory', 'transactionMemory', 'workMemory',
                 'jumperConnected', 'jumperState'],
                 self.command_callback(callback));
    };

    // 6.2.4 Tique Técnico (02 10)
    this._print_technical_ticket = function(callback) {
        self.common.command(
                '_print_technical_ticket',
                self.common.pack("<SW_W>*", sequence++, 0x0210, 0),
                '<SW_W__W__N_N_N_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'ticketNumber', 'totalAmount',
                 'vatAmount', 'returnAmount'],
                self.command_callback(callback));
    };

    // 6.3.1 Configurar Fecha y Hora (05 01)
    this._set_datetime = function(date, time, callback) {
        self.common.command(
                'set_datetime',
                self.common.pack("<SW_W_D_T>*", sequence++, 0x0501, 0, date, time),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.2 Obtener Configuración de Fecha y Hora (05 02)
    this.get_datetime = function(callback) {
        self.common.command(
                'get_datetime',
                self.common.pack("<SW_W>*", sequence++, 0x0502, 0),
                '<SW_W__W__N_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'date', 'time'],
                self.command_callback(callback));
    };

    // 6.3.3 Obtener Datos de Fiscalización (05 07)
    this.get_fiscal_data = function(print, callback) {
        self.common.command(
                'get_fiscal_data',
                self.common.pack("<SW_W>*", sequence++, 0x0507, print && 1),
                '<SW_W__W__P_N_N_L_R_N_A_A_R_A_N_N_N_D_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'razonSocial', 'cuit', 'caja', 'ivaResposabilidad',
                 'calle', 'numero', 'piso', 'depto', 'localidad', 'cpa', 'provincia',
                 'tasaIVA', 'maxMonto', 'fechaFiscalizacion', 'cambiosResponsablesDisponibles'],
                self.command_callback(callback));
    };

    // 6.3.4 Configurar Líneas de Encabezado (05 08)
    this.set_header_lines = function(lineno, text, callback) {
        self.common.command(
                'set_header_lines',
                self.common.pack("<SW_W_N30_R>*", sequence++, 0x0508, 0x0000, lineno, text),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.5 Obtener Configuración de Líneas de Encabezado (05 09)
    this.get_header_lines = function(lineno, callback) {
        self.common.command(
                'get_header_lines',
                self.common.pack("<SW_W_N30>*", sequence++, 0x0509, 0x0000, lineno),
                '<SW_W__W__R>*',
                ['printerStatus', 'fiscalStatus', 'result', 'text'],
                self.command_callback(callback));
    };

    // 6.3.6 Configurar Líneas de Cola (05 0A)
    this.set_footer_lines = function(lineno, text, callback) {
        self.common.command(
                'set_footer_lines',
                self.common.pack("<SW_W_N30_R>*", sequence++, 0x050A, 0x0000, lineno, text),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.7 Obtener Configuración de Líneas de Cola (05 0B)
    this.get_footer_lines = function(lineno, callback) {
        self.common.command(
                'get_footer_lines',
                self.common.pack("<SW_W_N30>*", sequence++, 0x050B, 0x0000, lineno),
                '<SW_W__W__R>*',
                ['printerStatus', 'fiscalStatus', 'result', 'text'],
                self.command_callback(callback));
    };

    // 6.3.8 Configurar Líneas de Información del Establecimiento (05 0E)
    this.set_pos_info = function(line, value, callback) {
        self.common.command(
                'set_pos_info',
                self.common.pack("<SW_W_R>*", sequence++, 0x050E, line, value),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.9 Obtener Líneas de Información del Establecimiento (05 0F)
    this.get_pos_info = function(line, callback) {
        self.common.command(
                'get_pos_info',
                self.common.pack("<SW_W>*", sequence++, 0x050F, line),
                '<SW_W__W__R>*',
                ['printerStatus', 'fiscalStatus', 'result', 'value'],
                self.command_callback(callback));
    };

    // 6.3.10 Iniciar Carga de Logo de Usuario (05 30)
    this._init_load_logo = function(width, height, quantity, callback) {
        self.common.command(
                'init_load_logo',
                self.common.pack("<SW_W_W_W_N10>*", sequence++, 0x0530, 0x0000,
                    width, height, quantity),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.11 Enviar Datos de Logo del Usuario (05 31)
    this._load_logo = function(bitmap, callback) {
        self.common.command(
                'logo_load',
                self.common.pack("<SW_W_B>*", sequence++, 0x0531, 0x0000,
                    bitmap),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.12 Terminar Carga de Logo del Usuario (05 32)
    this._finish_load_logo = function(callback) {
        self.common.command(
                'finish_logo_load',
                self.common.pack("<SW_W>*", sequence++, 0x0532, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.13 Cancelar Carga de Logo del Usuario (05 33)
    this._cancel_load_logo = function(callback) {
        self.common.command(
                'cancel_logo_load',
                self.common.pack("<SW_W>*", sequence++, 0x0533, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.14 Eliminar Logo del Usuario (05 34)
    this._delete_logo = function(callback) {
        self.common.command(
                'delete_logo',
                self.common.pack("<SW_W>*", sequence++, 0x0534, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.15 Configurar Monto Máximo de Tique-Factura / Nota de Crédito (05 40)
    this.set_max_amount = function(amount, callback) {
        self.common.command(
                'set_max_amount',
                self.common.pack("<SW_W_N92>*", sequence++, 0x0540, 0x0000,
                    amount),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.16 Impresión de arqueo de pagos (05 52)
    this.set_payment_report = function(active, callback) {
        self.common.command(
                'set_payment_report',
                self.common.pack("<SW_W>*", sequence++, 0x0552, active && 1),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    };

    // 6.3.17 Obtener estado de impresión de arqueo de pagos (05 53)
    this.get_payment_report = function(active, callback) {
        self.common.command(
                'get_payment_report',
                self.common.pack("<SW_W>*", sequence++, 0x0553, 0x0000),
                '<SW_W__W__N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'active'],
                self.command_callback(callback));
    };

    // 6.4.1 Avanzar Papel (07 01)
    this._advance_paper = function(station, lines, callback) {
        self.common.command(
                'advance_paper',
                self.common.pack("<SW_W_N20>*", sequence++, 0x0701, station & 0x0003, lines),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    }

    // 6.4.2 Cortar Papel (07 02)
    this._cut_paper = function(callback) {
        self.common.command(
                'cut_paper',
                self.common.pack("<SW_W>*", sequence++, 0x0702, 0x0000),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    }

    // 6.5.1 Reporte Z (08 01)
    this._z_report = function(showheadfoot, showinfo, callback) {
        var ext = (showinfo && 0x0800) + (showheadfoot && 0x0400);
        self.common.command(
                'z_report',
                self.common.pack("<SW_W>*", sequence++, 0x0801, 0x0C00),
                '<SW_W__W__W>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'closeNumber'],
                self.command_callback(callback));
    }

    // 6.5.2 Reporte X (08 02)
    this._x_report = function(showheadfoot, showinfo, print, callback) {
        var ext = (showinfo && 0x0800) + (showheadfoot && 0x0400) + (print && 0x0001);
        self.common.command(
                'x_report',
                self.common.pack("<SW_W>*", sequence++, 0x0802, ext),
                '<SW_W__W__W>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'closeNumber'],
                self.command_callback(callback));
    }

    // 6.5.4 Información Electrónica General de la Jornada Fiscal en Curso (08 0A)
    this._get_fiscal_information = function(from_last_x, callback) {
        var ext = (from_last_x && 0x0001);
        self.common.command(
                'get_fiscal_information',
                self.common.pack("<SW_W>*", sequence++, 0x080A, ext),
                '<SW_W__W__D_T_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_Y>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'date_open_fiscal_journal', // 1
                 'time_open_fiscal_journal', // 2
                 'last_z_report',
                 'last_a_sale_document',
                 'last_b_sale_document',     // 5
                 'last_a_credit_document',
                 'last_b_credit_document',
                 'last_nfiscal_document',
                 'last_nfiscal_homo_document',
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
                self.command_callback(callback));
    }

    // 6.5.23 Información de Contadores (08 30)
    this._get_counters = function(callback) {
        self.common.command(
                'get_counters',
                self.common.pack("<SW_W>*", sequence++, 0x0830, 0x0000),
                '<SW_W__W__N_N_N_N_N_N_N_N_N_N_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'last_z_report',                  // 1
                 'last_intervetion',
                 'last_b_sale_document',
                 'last_a_sale_document',
                 'last_nfiscal_document',          // 5
                 'last_nfiscal_homo_document',
                 'last_b_credit_document',
                 'last_a_credit_document',
                 'last_responsability',
                 'last_b_sale_document_completed', // 10
                 'last_a_sale_document_completed',
                 ],
                self.command_callback(callback));
    }

    // Comandos de Tique-Factura / Tique-Nota de Débito (0B)
    // 6.7.1 Abrir (0B 01)
    //
    // partner_document_type =  D: DNI,
    //                          L: CUIL,
    //                          T: CUIT,
    //                          C: Cedula de Identidad,
    //                          P: Pasaporte,
    //                          V: Libreta Civica,
    //                          E: Libreta Enrolamiento.
    // partner_document_number = I: Inscripto,
    //                           N: No responsable,
    //                           M: Monotributista,
    //                           E: Exento,
    //                           U: No categorizado,
    //                           F: Consumidor final,
    //                           T: Monotributista social,
    //                           P: Monotributista trabajador independiente promovido.
    //
    this._open_fiscal_ticket = function(
            triplicated,
            store_descriptions,
            keep_description_attributes,
            store_extra_descriptions,
            turist_ticket,
            debit_note,
            partner_name,
            partner_name_2,
            partner_address,
            partner_address_2,
            partner_address_3,
            partner_document_type,
            partner_document_number,
            partner_responsability,
            related_document,
            related_document_2,
            turist_check,
            callback) {
        var ext = (triplicated           && 0x0002) |
            (store_descriptions          && 0x0080) |
            (keep_description_attributes && 0x0100) |
            (store_extra_descriptions    && 0x0200) |
            (turist_ticket               && 0x1000) |
            (debit_note                  && 0x2000);

        self.common.command(
                'open_fiscal_ticket',
                self.common.pack("<SW_W_R_R_R_R_R_L_A_L_R_R_R>*", sequence++, 0x0B01, ext,
                        partner_name,
                        partner_name_2,
                        partner_address,
                        partner_address_2,
                        partner_address_3,
                        partner_document_type,
                        partner_document_number,
                        partner_responsability,
                        related_document,
                        related_document_2,
                        turist_check),
                '<SW_W__W_>*',
                ['printerStatus', 'fiscalStatus', 'result'],
                self.command_callback(callback));
    }

    // 6.7.2 Item (0B 02)
    //
    // Realiza la emisión de ítem de venta o la devolución de un ítem en forma total o parcial. Acumula los
    // importes facturados en la memoria de trabajo y calcula los impuestos de acuerdo a la tasa de
    // impuestos enviada. Permite la emisión de ítems de bonificación y su correspondiente anulación.
    //
    // INPUT
    //
    // item_action = sale_item: Item de venta.
    //               cancel_sale_item: Anulación de ítem de venta.
    //               return_can: Item de retorno de envases.
    //               cancel_return_can: Anulación de ítem de retorno de envases.
    //               return_item: Item de retorno.
    //               cancel_return_item: Anulación de ítem de retorno.
    //               discount_item: Item de descuento.
    //               cancel_discount_item: Anulación de ítem de descuento.
    // as_gross = Considerar parámetros como montos Brutos.
    // send_subtotal = Envía campo Subtotal parcial del tique.
    // check_item = Marcar ítem.
    // collect_type = q: Contabilizar ítem de venta igual a la cantidad Q.
    //                unit: Contabilizar ítem de venta como cantidad unitaria (bulto).
    //                none: No contabilizar ítem de venta en cantidad de unidades.
    // large_label = Imprime leyenda larga.
    // first_line_label = Imprime leyenda en la primera línea de descripción.
    // description = Descripción extra #1
    // description_2 = Descripción extra #2
    // description_3 = Descripción extra #3
    // description_4 = Descripción extra #4
    // item_description = Descripción del ítem
    // quantity = Cantidad
    // unit_price = Precio unitario
    // vat_rate = Tasa de IVA
    // fixed_taxes = Impuestos internos fijos
    // taxes_rate = Coeficiente de impuestos internos porcentuales
    //
    // OUTPUT
    //
    // subtotal = Subtotal parcial del tique-factura o tique-nota de débito.
    //
    this._item_fiscal_ticket = function(
            item_action,
            as_gross,
            send_subtotal,
            check_item,
            collect_type,
            large_label,
            first_line_label,
            description,
            description_2,
            description_3,
            description_4,
            item_description,
            quantity,
            unit_price,
            vat_rate,
            fixed_taxes,
            taxes_rate,
            callback) {
        var ext = (item_action == 'sale_item'            && 0x0000) |
                  (item_action == 'cancel_sale_item'     && 0x0001) |
                  (item_action == 'return_can'           && 0x0002) |
                  (item_action == 'cancel_return_can'    && 0x0003) |
                  (item_action == 'return_item'          && 0x0004) |
                  (item_action == 'cancel_return_item'   && 0x0005) |
                  (item_action == 'discount_item'        && 0x0006) |
                  (item_action == 'cancel_discount_item' && 0x0007) |
                  (as_gross                              && 0x0008) |
                  (send_subtotal                         && 0x0010) |
                  (check_item                            && 0x0020) |
                  (collect_type == 'q'                   && 0x0000) |
                  (collect_type == 'unit'                && 0x0040) |
                  (collect_type == 'none'                && 0x0080) |
                  (large_label                           && 0x1000) |
                  (first_line_label                      && 0x2000);
        self.common.command(
                'item_fiscal_ticket',
                self.common.pack("<SW_W_R_R_R_R_R_N54_N74_N22_N74_N08>*", sequence++, 0x0B02, ext,
                        description,
                        description_2,
                        description_3,
                        description_4,
                        item_description,
                        quantity,
                        unit_price,
                        vat_rate,
                        fixed_taxes,
                        taxes_rate),
                '<SW_W__W_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'subtotal'],
                self.command_callback(callback));
    }

    // 6.7.3 Subtotal (0B 03)
    //
    // Retorna el subtotal facturado dentro del tique-factura o nota de débito fiscal.
    //
    // INPUT
    //
    // no_print = No imprime el subtotal.
    // type = gross: Solo devuelve el campo de total bruto
    //        net:   Solo devuelve el campo de total neto
    //        both:  Devuelve ambos totales
    //        none:  No devuelve nada
    //
    // OUTPUT
    //
    // gross = Subtotal parcial del tique-factura o nota de débito ( bruto )
    // net = Subtotal parcial del tique-factura o nota de débito ( neto )
    //
    this._subtotal_fiscal_ticket = function(
            print,
            type,
            callback) {
        var ext = (no_print        && 0x0001) |
                  (type == 'gross' && 0x0004) |
                  (type == 'net'   && 0x0008) |
                  (type == 'both'  && 0x000A);
        self.common.command(
                'subtotal_fiscal_ticket',
                self.common.pack("<SW_W>*", sequence++, 0x0B03, ext),
                '<SW_W__N_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'gross',
                 'net'],
                self.command_callback(callback));
    }

    // 6.7.4 Descuentos/Recargos (0B 04)
    //
    // Aplica un descuento o recargo global a los montos facturados en el tique-factura o nota de débito fiscal.
    //
    // INPUT
    //
    // type = discount: Descuento
    //        charge: recargo
    // description = Descripción
    // amount = Monto de descuento/recargo
    //
    // OUTPUT
    //
    // subtotal = Subtotal parcial del tique-factura o nota de débito.
    //
    this._discount_charge_fiscal_ticket = function(
            type,
            callback) {
        var ext = (type == 'discount' && 0x0000) |
                  (type == 'charge'   && 0x0001);
        self.common.command(
                'discount_charge_fiscal_ticket',
                self.common.pack("<SW_W_R_NA2>*", sequence++, 0x0B04, ext,
                    description,
                    amount),
                '<SW_W__N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'subtotal'],
                self.command_callback(callback));
    }

    // 6.7.5 Pagos (0B 05)
    //
    // Aplica un pago al tique-factura o nota de débito fiscal en proceso de emisión.
    //
    // INPUT
    //
    // Aplica un pago al tique-factura o nota de débito fiscal en proceso de emisión.
    // type =
    //   null_pay = Anulación de pago.
    //   no_include_cash_count = No incluye pago en arqueo de pagos.
    //   card_pay = Pago con tarjeta.
    // extra_description = Descripción extra del pago
    // description = Descripción del pago
    // amount = Monto de pago
    //
    // RETURN
    //
    // result = Monto restante por pagar
    // change = Monto de vuelto
    //
    this._pay_fiscal_ticket = function(
            type,
            extra_description,
            description,
            amount,
            callback) {
        var ext = (type == 'null_pay'                && 0x0001) |
                  (type == 'no_include_cash_count'   && 0x0002) |
                  (type == 'card_pay'                && 0x0004);
        self.common.command(
                'pay_fiscal_ticket',
                self.common.pack("<SW_W_R_R_NA2>*", sequence++, 0x0B05, ext,
                    extra_description,
                    description,
                    amount),
                '<SW_W__N_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'result',
                 'change'],
                self.command_callback(callback));
    }

    // 6.7.6 Cerrar (0B 06)
    //
    // Realiza el cierre del tique-factura o nota de débito fiscal almacenando los datos de la transacción en la memoria de transacciones.
    //
    // INPUT
    //
    // cut_paper = Cortar papel.
    // electronic_answer = Devuelve respuesta electrónica.
    // print_return_attribute = Imprime “Su Vuelto” con atributos.
    // current_account_automatic_pay = Utiliza pago automático como cuenta corriente.
    // print_quantities = Imprimir Cantidad de unidades.
    // tail_no = Número de línea de cola de reemplazo #1
    // tail_text = Descripción de reemplazo #1
    // tail_no_2 = Número de línea de cola de reemplazo #2
    // tail_text_2 = Descripción de reemplazo #2
    // tail_no_3 = Número de línea de cola de reemplazo #3
    // tail_text_3 = Descripción de reemplazo #3
    //
    // RETURN
    //
    // printerStatus = estado de la impresora.
    // fiscalStatus = estado fiscal del equipo.
    // result = resultado del comando.
    // document_number = Número del tique-factura o nota de débito fiscal
    // document_type = Tipo de tique-factura o nota de débito (‘A’, ‘B’, ‘C’)
    // document_amount = Monto total del tique-factura o nota de débito fiscal
    // document_vat = Monto total de IVA del tique-factura o nota de débito fiscal
    // document_return = Vuelto final
    //
    this._close_fiscal_ticket = function(
            cut_paper,
            electronic_answer,
            print_return_attribute,
            current_account_automatic_pay,
            print_quantities,
            tail_no,
            tail_text,
            tail_no_2,
            tail_text_2,
            tail_no_3,
            tail_text_3,
            callback) {
        var ext = (cut_paper                             && 0x0001) |
                  (electronic_answer                     && 0x0002) |
                  (print_return_attribute                && 0x0004) |
                  (current_account_automatic_pay         && 0x0010) |
                  (print_quantities                      && 0x0100);
        self.common.command(
                'close_fiscal_ticket',
                self.common.pack("<SW_W_N30_R_N30_R_N30_R>*", sequence++, 0x0B06, ext,
                        tail_no,
                        tail_text,
                        tail_no_2,
                        tail_text_2,
                        tail_no_3,
                        tail_text_3),
                '<SW_W__W_N_L_N_N_N>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'document_number',
                 'document_type',
                 'document_amount',
                 'document_vat',
                 'document_return'],
                self.command_callback(callback));
    }

    //
    // 6.7.7 Cancelar (0B 07)
    //
    // Realiza la cancelación del tique-factura o nota de débito fiscal.
    //
    // INPUT
    //
    // RETURN
    //
    // document_number = Número del tique factura o nota de débito.
    // document_type = Tipo de tique-factura o nota de débito (‘A’, ‘B’, ‘C’)
    //
    this._cancel_fiscal_ticket = function(callback) {
        self.common.command(
                'cancel_fiscal_ticket',
                self.common.pack("<SW_W>*", sequence++, 0x0B07, 0x0000),
                '<SW_W__N_L>*',
                ['printerStatus', 'fiscalStatus', 'result',
                 'document_number',
                 'document_type'],
                self.command_callback(callback));
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

        'commercial_address_1': function(callback) { self.get_pos_info(0, function(response) { callback(response && response.value); }); },
        'commercial_address_2': function(callback) { self.get_pos_info(1, function(response) { callback(response && response.value); }); },
        'commercial_address_3': function(callback) { self.get_pos_info(2, function(response) { callback(response && response.value); }); },

        'fiscal_address_1': function(callback) { self.get_pos_info(3, function(response) { callback(response && response.value); }); },
        'fiscal_address_2': function(callback) { self.get_pos_info(4, function(response) { callback(response && response.value); }); },
        'fiscal_address_3': function(callback) { self.get_pos_info(5, function(response) { callback(response && response.value); }); },

        'iibb_1': function(callback) { self.get_pos_info(6, function(response) { callback(response && response.value); }); },
        'iibb_2': function(callback) { self.get_pos_info(7, function(response) { callback(response && response.value); }); },
        'iibb_3': function(callback) { self.get_pos_info(8, function(response) { callback(response && response.value); }); },

        'activity_init': function(callback) { self.get_pos_info(9, function(response) { callback(response && response.value); }); },
    };

    this.write_operation = {
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

        'commercial_address_1': function(value_, callback) { self.set_pos_info(0, value_, function(response) { callback(response); }); },
        'commercial_address_2': function(value_, callback) { self.set_pos_info(1, value_, function(response) { callback(response); }); },
        'commercial_address_3': function(value_, callback) { self.set_pos_info(2, value_, function(response) { callback(response); }); },

        'fiscal_address_1': function(value_, callback) { self.set_pos_info(3, value_, function(response) { callback(response); }); },
        'fiscal_address_2': function(value_, callback) { self.set_pos_info(4, value_, function(response) { callback(response); }); },
        'fiscal_address_3': function(value_, callback) { self.set_pos_info(5, value_, function(response) { callback(response); }); },

        'iibb_1': function(value_, callback) { self.set_pos_info(6, value_, function(response) { callback(response); }); },
        'iibb_2': function(value_, callback) { self.set_pos_info(7, value_, function(response) { callback(response); }); },
        'iibb_3': function(value_, callback) { self.set_pos_info(8, value_, function(response) { callback(response); }); },

        'activity_init': function(value_, callback) { self.set_pos_info(9, value_, function(response) { callback(response); }); },
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

        var do_response = function(response) {
            var date = response.date;
            var time = response.time;
            if (date && time) {
                fields['clock'] = "20"+date.slice(4,6)+"-"+date.slice(2,4)+"-"+date.slice(0,2)+" "+time.slice(0,2)+":"+time.slice(2,4)+":"+time.slice(4,6);
                fields['printerStatus'] = 'Impresora: ' + response.strPrinterStatus + '\nFiscal: ' + response.strFiscalStatus;
                callback({fields: fields, attributes: attributes, readonly: readonly});
            } else {
                callback({'error': 'date-time error'})
            }
        };

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
                self.get_datetime(do_response);
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
        if (self.common.busy) {
            callback({'status': 'busy'});
        } else {
            self._get_status(function(res) {
                self._status = res;
                if (res && res.result != null) {
                    callback(res);
                } else {
                    callback({'error': 'disconnected'});
                }
            });
        }
    };

    // Info
    this.get_info = function(callback) {
        var self = this;
        if (self.common.busy) {
            callback({'status': 'busy'});
        } else {
            self._get_status(function(res) {
                if (res) {
                    self._get_id(function(res) {
                        self._status = res;
                        callback(res);
                    });
                } else {
                    callback({'error': 'disconnected'});
                }
            });
        };
    };

    // Tests

    // API: Execute short test
    this.short_test = function(callback) {
        var self = this;
        self._ripple_test(0, 10, function(res) {
            callback(res);
        });
    };

    // API: Execute large test
    this.large_test = function(callback) {
        var self = this;
        self._print_diag_report(0, function(res) {
            self._ripple_test(0, 10, function(res) {
                self._print_technical_ticket(function(res) {
                    callback(res);
                });
            });
        });
    };

    // Logo Control
    this.load_logos = function(logos, callback) {
        var self = this;
        async.eachSeries(logos, function(item, __callback__) {
            var size = item[0];
            var data = _base64ToArrayBuffer(item[1]);
            var maxsize = 1024;
            var position = 0;
            self._init_load_logo(size[0], size[1], 1, function(res) {
                if (res.result != 0) { callback(res); return; }
                async.whilst(
                    function() { return position < data.byteLength; },
                    function(___callback___) {
                        self._load_logo(data.slice(position, maxsize), function(res) {
                            position += maxsize;
                            ___callback___();
                        });
                    },
                    function() {
                        self._finish_load_logo(__callback__);
                    }
                );
            });
        }, function() { callback({}); } )
    };

    // Paper Control
    this.remove_logos = function(logos, callback) {
        var self = this;
        self._delete_logo(callback);
    };

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

    // API: Return counters
    this.get_counters = function(callback) {
        var self = this;
        self._get_counters(callback);
    }

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

    // API: Make ticket.
    this.make_fiscal_ticket  = function(options, ticket, callback) {
        var self = this;

        var cancel_fiscal_ticket = function(ret) {
            ret = ret || {};
            ret.error = 'ticket canceled'
            callback(ret);
        }

        self._open_fiscal_ticket(
			    options.triplicated || false,
			    options.store_description || false,
			    options.keep_description_attributes || false,
                options.store_extra_descriptions || false,
			    ticket.turist_ticket || false,
			    ticket.debit_note || false,
			    ticket.partner.name,
			    ticket.partner.name_2 || "",
			    ticket.partner.address,
			    ticket.partner.address_2 || "",
			    ticket.partner.address_3 || "",
			    ticket.partner.document_type,
			    ticket.partner.document_number,
			    ticket.partner.responsability,
			    ticket.related_document || "",
			    ticket.related_document_2 || "",
			    ticket.turist_check || "",
	    function(res) {
        if (res.result != 0) {
            console.error(res.strResult);
            callback({'error': 'Cant open ticket:' + res.strResult});
        } else
        async.eachSeries(ticket.lines || [],
            function(line, _callback_){
            self._item_fiscal_ticket(
                    line.item_action || "sale_item",
                    line.as_gross || false,
                    line.send_subtotal || false,
                    line.check_item || false,
                    line.collect_type || 'q',
                    line.large_label || "",
                    line.firt_line_label || "",
                    line.description || "",
                    line.description_2 || "",
                    line.description_3 || "",
                    line.description_4 || "",
                    line.item_description,
                    line.quantity || 1,
                    -line.unit_price,
                    line.vat_rate || 0,
                    line.fixed_taxes || 0,
                    line.taxes_rate || 0,
                    function(res) {
                        if (res.result != 0) {
                            console.error(res.strResult);
                            self._cancel_fiscal_ticket(cancel_fiscal_ticket);
                        } else {
                            _callback_();
                        }
                    }
                );
            }, function() {
        async.eachSeries(ticket.payments || [],
            function(pay, _callback_){
            self._pay_fiscal_ticket(
                    pay.type,
                    pay.extra_description,
                    pay.description,
                    pay.amount,
                    function(res) {
                        if (res.result != 0) {
                            console.error(res.strResult);
                            self._cancel_fiscal_ticket(callback_fiscal_ticket);
                        } else {
                            _callback_();
                        }
                    }
                );
            }, function() {
            self._close_fiscal_ticket(
                    options.cut_paper || true,
                    options.electronic_answer || false,
                    options.print_return_attribute || false,
                    options.current_account_automatic_pay || false,
                    options.print_quantities || false,
                    options.tail_no || 0,
                    options.tail_text || "",
                    options.tail_no_2 || 0,
                    options.tail_text_2 || "",
                    options.tail_no_3 || 0,
                    options.tail_text_3 || "",
            function(res) {
            if (res.result != 0) {
                console.error(res.strResult);
                self._cancel_fiscal_ticket(cancel_fiscal_ticket);
            } else {
                callback(res);
            }
            });
	    });
	    });
	    });
    };

    // API: Cancel ticket.
    this.cancel_fiscal_ticket  = function(callback) {
        var self = this;
        self._cancel_fiscal_ticket(1,1,1,callback);
    };
};

function epson_e_ar_open(device, port, callback) {
    console.debug("EPSON: Rev E Constructor");
    if (port == 'usb') {
        var inter = new usb(device);
        inter.open(function(inter){
          if (inter) { callback(new epson_e_ar(inter)); }
          else callback();
        });
    } else
    if (port == 'serial') {
        var inter = new serial(device);
        inter.open(function(inter){
          if (inter) {
              // Check if its the right protocol for this device
              var dev = new epson_e_ar(inter);
              dev._get_status(function(res) {
                  if (res.result != null) {
                      callback(dev);
                  } else {
                      callback();
                  }
              })
          }
          else callback();
        });
    };
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
