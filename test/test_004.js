//

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

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
