var express = require('express');
var j5 = require("johnny-five");
var board;
var leds = [];
var LEDPIN = 5;
var LEDPIN2 = 7;
var led;
var app = express();
var path = require('path');

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/conect', function (req, res) {
	board = new j5.Board();

	board.on("ready", function(){
		res.send('Arduino conectado con exito');
	});
})
app.get('/on', function (req, res) {
	led.on();
	res.send('Led encendido');
})
app.get('/off', function (req, res) {
	led.off();
	res.send('Led apagado');
});
app.get('/pulse', function (req, res) {
	led2.pulse();
	res.send('pulse');
});
app.get('/convert/:num', function (req, res){
	var num = req.params.num;
	convert(num);
});
function startLeds(){
	console.log('startLeds');
	//var pinLeds = [2,3,4,5,6,7,8,9];
	var pinLeds = [9,8,7,6,5,4,3,2];
	pinLeds.forEach(function (pinled) {
		console.log(pinled);
		leds.push(new j5.Led(pinled));
	});
}
 function convert(num){
 	console.log('convert');
 	startLeds();
 	var binario = 0;
 	while(num!=0){
		if( (num%2)===0 ){
			binario= "0" + binario;
		}else{
			binario = "1" + binario;
		}
		num = num/2;
		num = parseInt(num,10);
	}
	//binario = binario.substring(0, binario.length - 1);
	binario = binario.split("").reverse().join("");

	printBinary(binario, leds);
 }
function printBinary(numBinary, leds){
	offAll(leds);
	console.log("Numero binario " + numBinary);
	for (var i = 0; i <= numBinary.length; i++) {
		if(numBinary[i] == 1){
			leds[i].on();
		}
	};
}
function offAll(leds){
	leds.forEach(function (led){
		led.off();
	});
}

app.listen(8080);