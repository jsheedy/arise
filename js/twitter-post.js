// only run every once in a while, schedule every minute from cron.
DEBUG = process.argv[2] == "--debug"
NOW = process.argv[2] == "--now"
LOOP = process.argv[2] == "--loop"

var startWord = "";
startWord=null;
if(process.argv[2] == "--start") {
  DEBUG=true;
  startWord = process.argv[3]; 
}

if(LOOP) {
  DEBUG = true;
}

var sleeptime = 0;

if(! DEBUG && ! NOW) {
  if(Math.random() > 0.012) {
    console.log("exiting");
    process.exit(code=0);
  }
  sleeptime = Math.random() * 60 * 5 * 1000;
  console.log("continuing in seconds: " +  sleeptime);
}

setTimeout(post, sleeptime)

function post() 
{
  var twitter = require('ntwitter');

  var graph = require(__dirname + '/create_graph_from_local_file.js').graph;
  var credentials = require(__dirname + '/twitter-credentials.js').credentials;
  
  var twit = new twitter(credentials);

  graph.load(function() {
    function speak() {
      var spk = ""
      var numberOfSentences = parseInt(1 + Math.random()*5);
      while( spk = graph.Speak(startWord, numberOfSentences))
      {
        if(spk.length <= 140 && spk.length >= 10) {
          break;
        }
      }
      spk = spk.replace(/[@]*velotron([ .,!;'"]+)/gi, "@velotron$1");
      spk = spk.replace(/[@]*anatomecha([ .,!;'"]+)/gi, "@anatomecha$1");
      return spk;
    }

    var spk = speak();
    console.log(spk);

    if(LOOP) {
      while(true) {
        console.log(speak());
      }
    }
    if(!DEBUG)
    {
      twit.updateStatus(spk,
          function (err, data) {
            console.log("data: ");
            console.log(data);
            console.log("err: ");
            console.log(err);
          }
      );
    }
  });

}
