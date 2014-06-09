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
    test_start("002_001");
   
    function end() {
        test_end("002_001");
    };

    function t_print_ticket(printers, end) {
	    var t_printer = printers[takeKeys(printers)[0]]
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


// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
