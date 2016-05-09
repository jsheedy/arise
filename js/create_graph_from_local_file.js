var utf8 = require('utf8');
var fs = require('fs');
var graph = require('./comms_graph.js').graph;
exports.graph = graph;

var re = new RegExp(/\s+/gm);

function split(body) {
  return body.trim().replace(/\s+>/gm, " ").replace(/[\r\n ]+/gm, " ").split(re).map(
    function(x) {
      return x.toLowerCase();
    });
}

graph.load = function(cb) {
  var commsDb = null;
  fs.readFile(__dirname + "/../comms/comms.json", 'utf8', function(err,data) {
  	if(err) throw err;
    data = utf8.encode(data);
  	commsDb = JSON.parse(data);
  	for (var i=0; i<commsDb.length; i++) {
  		var item = commsDb[i];
  	  var tokens = split(item.subject + " " + item.body);
  	  graph.AddWords([tokens]);
  	}

  	if(cb)
      cb.call();
  });
}


