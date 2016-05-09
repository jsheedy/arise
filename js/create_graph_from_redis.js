var fs = require('fs');
var graph = require('./comms_graph.js').graph;
exports.graph = graph;

var re = new RegExp(/\s+/gm);

var redis = require("redis"),
    client = redis.createClient();

  client.on("error", function (err) {
      console.log("Error " + err);
  });


function split(body) {
  return body.trim().replace(/\s+>/gm, " ").replace(/[\r\n ]+/gm, " ").split(re).map(
    function(x) {
      return x.toLowerCase();
    });
}

graph.load = function(cb) {
  //var commsDb = null;
  //fs.readFile(__dirname + "/../comms/comms.json", function(err,data) {
  	//if(err) throw err;
  	// commsDb = JSON.parse(data);
    client.keys("*", function(err,rep) {
      console.log('woot', rep.length);

  	for (var i=0; i<rep.length; i++) {
  		//var item = commsDb[i];
      var title = rep[i];
      var content = client.get(title, function(err,response) {
      if (response) {
        //console.log(response);
        var tokens = split(response);
        graph.AddWords([tokens]);
      } else {
        //console.log("not reponse?", title);
      } 
      });
  	}
  	console.log("graph holds " + graph.WordCount() +  " words");

  	if(cb)
      cb.call();
  });
}

graph.load(function() {
    setInterval(function() {console.log("\n", graph.Speak("yoga", 10));}, 100);
});
