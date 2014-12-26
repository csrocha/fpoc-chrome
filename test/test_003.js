function test_003_001() {
    test_start("003_001");
   
    function end() {
        test_end("003_001");
    };

    chrome.serial.getDevices(function(devs) {
	var dev = devs[0];
	console.log(dev);

	var s = new serial(dev);

	s.open(function(_s) {
		_s.send(str2ab("Hola mundo"), function(res) {
			console.log(res);
		});
	});

    })

};

// vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
