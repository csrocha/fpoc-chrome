// Solo una linea

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
            t_printer._subtotal_ticket_notacredito(
                false,
                'both',
        function(res) {
            if (res.result != 0) {
            console.error(res.strResult);
            return; }
	console.log(res);
            t_printer._pay_ticket_notacredito(
		false,
		true,
		'0x0',
		100,
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
