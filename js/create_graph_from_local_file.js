var fs = require('fs');
var graph = require('./comms_graph.js').graph;
exports.graph = graph;

var re = new RegExp(/\s+/gm);

function split(body) {
  return body.trim().split(re).map(
    function(x) {
      return x.toLowerCase();
    });
}

graph.load = function(cb) {
  var commsDb = null;
  fs.readFile(__dirname + "/../comms/comms.json", function(err,data) {
  	if(err) throw err;
  	commsDb = JSON.parse(data);
  	for (var i=0; i<commsDb.length; i++) {
  		var item = commsDb[i];
  	  var tokens = split(item.subject + " " + item.body);
  	  graph.AddWords([tokens]);
  	}
  	//console.log("graph holds " + graph.WordCount() +  " words");

  	if(cb)
      cb.call();
  });
}


