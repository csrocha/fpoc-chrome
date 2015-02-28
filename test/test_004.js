function test_004_001() {
    test_start("004_001");

    function end() {
        test_end("004_001");
    };

    function t_print_ticket(printers, end) {
        var t_printer = printers[takeKeys(printers)[0]]
        t_printer._open_ticket_notacredito(
                false,
                "Cristian S. Rocha",
                "",
                "Av. Rivadavia 9858",
                "(1407) Buenos Aires",
                "Argentina",
                "D",
                "25095454",
                "F",
                "",
                "",
                "Origin",
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        console.log(res);
        t_printer._item_ticket_notacredito(
                "sale_item",
                false,
                false,
                "q",
                false,
                false,
                "",
                "",
                "",
                "",
                "Test item",
                1,
                100,
                21.00,
                0,
                0,
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        console.log(res);
            t_printer._close_ticket_notacredito(
                true,
                true,
                true,
                0,
                "",
                0,
                "",
                0,
                "",
		            3,
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        end();
        });
        });
        });
    };

    query_local_printers(
            function(printers) { t_print_ticket(printers, end); },
            function() { console.log("Something change") }
            );
};

// Con sub total

function test_004_002() {
    test_start("004_002");

    function end() {
        test_end("004_002");
    };

    function t_print_ticket(printers, end) {
        var t_printer = printers[takeKeys(printers)[0]]
        t_printer._open_ticket_notacredito(
                false,
                "Cristian S. Rocha",
                "",
                "Av. Rivadavia 9858",
                "(1407) Buenos Aires",
                "Argentina",
                "D",
                "25095454",
                "F",
                "",
                "",
                "Origin",
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        console.log(res);
        t_printer._item_ticket_notacredito(
                "sale_item",
                false,
                false,
                "q",
                false,
                false,
                "",
                "",
                "",
                "",
                "Test item",
                1,
                100,
                21.00,
                0,
                0,
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        console.log(res);
            t_printer._close_ticket_notacredito(
                true,
                true,
                true,
                0,
                "",
                0,
                "",
                0,
                "",
		            3,
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        console.log(res);
            t_printer._subtotal_ticket_notacredito(
                false,
                'both',
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        end();
        });
        });
        });
        });
    };

    query_local_printers(
            function(printers) { t_print_ticket(printers, end); },
            function() { console.log("Something change") }
            );
};

// Con sub total y pago

function test_004_003() {
    test_start("004_003");

    function end() {
        test_end("004_003");
    };

    function t_print_ticket(printers, end) {
        var t_printer = printers[takeKeys(printers)[0]]
        t_printer._open_ticket_notacredito(
                false,
                "Cristian S. Rocha",
                "",
                "Av. Rivadavia 9858",
                "(1407) Buenos Aires",
                "Argentina",
                "D",
                "25095454",
                "F",
                "",
                "",
                "Origin",
          function(res) {
            if (res.result != 0) { console.error(res.strResult); return; }
            console.log(res);
            t_printer._item_ticket_notacredito(
                "sale_item",
                false,
                false,
                "q",
                false,
                false,
                "",
                "",
                "",
                "",
                "Test item",
                1,
                100,
                21.00,
                0,
                0,
          function(res) {
            if (res.result != 0) {console.error(res.strResult); return; }
            console.log(res);
            t_printer._subtotal_ticket_notacredito(
                false,
                'both',
          function(res) {
            if (res.result != 0) { console.error(res.strResult); return; }
	          console.log(res);
            t_printer._pay_ticket_notacredito(
            		false,
            		true,
            		'VISA',
            		'VISA',
            		121,
          function(res) {
            if (res.result != 0) { console.error(res.strResult); return; }
            console.log(res);
            t_printer._close_ticket_notacredito(
                true,
                true,
                true,
                0,
                "T1",
                0,
                "T2",
                0,
                "T3",
                3,
          function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
            end();
        });
        });
        });
        });
        });
    };

    query_local_printers(
            function(printers) { t_print_ticket(printers, end); },
            function() { console.log("Something change") }
            );
};

function test_004_004() {
    test_start("004_004");

    function end() {
        test_end("004_004");
    };

    function t_print_ticket(printers, end) {
        var t_printer = printers[takeKeys(printers)[0]];
        if (t_printer == null) {
            console.error("No printer to test.");
            return;
        };
        var options = {
            triplicated: false,
            store_description: false,
            keep_description_attributes: false,
            store_extra_descriptions: false,
        };
        var ticket = {
            partner: {
                name: "Cristian S. Rocha",
                name_2: "",
                address: "Av. Rivadavia 9858",
                address_2: "Buenos Aires",
                address_3: "Argentina",
                document_type: "D",
                document_number: "25095454",
                responsability: "F",
            },
            related_document: "",
            related_document_2: "",
            origin_document: "B0001000010000",
            lines: [ {
                item_action: "sale_item",
                as_gross: false,
                send_subtotal: false,
                check_item: false,
                collect_type: "q",
                large_label: "",
                first_line_label: "",
                description: "",
                description_2: "",
                description_3: "",
                description_4: "",
                item_description: "Item 1",
                quantity: 1,
                unit_price: 100,
                vat_rate: 21.0,
                fixed_taxes: 0,
                taxes_rate: 0,
                }, {
                item_action: "sale_item",
                as_gross: false,
                send_subtotal: false,
                check_item: false,
                collect_type: "q",
                large_label: "",
                first_line_label: "",
                description: "",
                description_2: "",
                description_3: "",
                description_4: "",
                item_description: "Item 2",
                quantity: 2,
                unit_price: 200,
                vat_rate: 20.0,
                fixed_taxes: 0,
                taxes_rate: 0,
                },
            ],
            cut_paper: true,
            electronic_answer: false,
            print_return_attribute: false,
            current_account_automatic_pay: false,
            print_quantities: false,
            tail_no: 0,
            tail_text: "Test 002 003",
            tail_no_2: 0,
            tail_text_2: "",
            tail_no_3: 0,
            tail_text_3: "",
        };

        t_printer.make_ticket_notacredito(options, ticket, function(res) {
            console.log(res);
        });
    };

    query_local_printers(
            function(printers) { t_print_ticket(printers, end); },
            function() { console.log("Something change a lot") }
            );
};

function reset_test_004() {
    test_start("reset_test_004");

    function end() {
        test_end("reset_test_004");
    };


    function t_cancel_ticket(printers, end) {
        var t_printer = printers[takeKeys(printers)[0]]
        t_printer._cancel_ticket_notacredito(
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        console.log(res);
	});
    };

    query_local_printers(
            function(printers) { t_cancel_ticket(printers, end); },
            function() { console.log("Something change") }
            );
}


// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
