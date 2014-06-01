//

function test_start(mess) {
    console.log("START: ", mess);
};

function test_end(mess) {
    console.log("END: ", mess);
};

function test_001_001() {
    var local_printers = null;
    test_start("001_001");
   
    function end() {
        test_end("001_001");
    };

    function t_get_id(printers, end) {
        debugger;
        end();
    };

    query_local_printers(
            function(printers) { t_get_id(printers, end); },
            function() { console.log("Something change") }
            );
};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
