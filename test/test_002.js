//

function test_002_001() {
    test_start("002_001");
   
    function end() {
        test_end("002_001");
    };

    function t_print_ticket(printers, end) {
        var t_printer = printers[takeKeys(printers)[0]]
        t_printer._open_fiscal_ticket(
                false,
                false,
                false,
                false,
                false,
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
                "",
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        console.log(res);
        t_printer._item_fiscal_ticket(
                "sale_item",
                false,
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
            t_printer._close_fiscal_ticket(
                    true,
                true,
                true,
                true,
                true,
                0,
                "",
                0,
                "",
                0,
                "",
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

function test_002_002() {
    test_start("002_002");
   
    function end() {
        test_end("002_002");
    };

    function t_print_ticket(printers, end) {
        var t_printer = printers[takeKeys(printers)[0]];
        t_printer._item_fiscal_ticket(
                "sale_item",
                false,
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
                21,
                0,
                0,
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        console.log(res);
            t_printer._close_fiscal_ticket(
                    true,
                true,
                true,
                true,
                true,
                0,
                "",
                0,
                "",
                0,
                "",
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
        end();
        });
        });
    };

    query_local_printers(
            function(printers) { t_print_ticket(printers, end); },
            function() { console.log("Something change") }
            );
};

function test_002_003() {
    test_start("002_003");
   
    function end() {
        test_end("002_003");
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
            turist_ticket: false,
            debit_note: false,
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
            turist_check: "",
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
           
        t_printer.make_fiscal_ticket(options, ticket, function(res) {
            console.log(res);
        });
    };

    query_local_printers(
            function(printers) { t_print_ticket(printers, end); },
            function() { console.log("Something change a lot") }
            );
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
