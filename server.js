//var WEBSOCKETS_LISTEN_ADDR = "192.168.0.139";
//var WEBSOCKETS_LISTEN_ADDR = "192.168.0.3";
var WEBSOCKETS_LISTEN_PORT = 37339;

var OSC_LISTEN_PORT = 37337;
var OSC_LISTEN_ADDR = "localhost";
var OSC_SEND_ADDR = "localhost";
var OSC_SEND_PORT = 37338;

var osc = require('osc4node');
var dgram = require('dgram');
var io = require('socket.io');
var express = require('express');

var app = express.createServer()
  , io = io.listen(app);
  
app.use(express.static(__dirname));
  
io.set('log level', 1); // reduce logging
//app.listen(WEBSOCKETS_LISTEN_PORT, WEBSOCKETS_LISTEN_ADDR);
app.listen(WEBSOCKETS_LISTEN_PORT);

var osc_server = new osc.Server(OSC_LISTEN_PORT,OSC_LISTEN_ADDR);
var osc_client = new osc.Client(OSC_SEND_ADDR, OSC_SEND_PORT);

var graph = require(__dirname + '/js/create_graph_from_local_file.js').graph;

graph.load(function() {
  setInterval(function() {
    var msg = graph.Speak();
    var message = new osc.Message("/text", msg);
    osc_server.send(message, osc_client);
    io.sockets.volatile.emit("message", {text: msg });
  }, 2000);
});

osc_server.on("message", function (msg, rinfo) {
  //console.log(msg);
  //var path = msg[0];
  io.sockets.emit('osc', { osc: msg });
});

io.sockets.on('connection', function(socket) {
  socket.on("slider", function(data) {
    console.log("slider: " + data.slider );
    var message = new osc.Message("/slider", data.slider / 1000.0);
    osc_server.send(message, osc_client);
  });
});



