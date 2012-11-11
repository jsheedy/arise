// only run every once in a while, schedule every minute from cron.
DEBUG = process.argv[2] == "--debug"
NOW = process.argv[2] == "--now"

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

  var twit = new twitter({
    consumer_key: 'yPCA3dFwRCOwIHZZMhWtxw',
    consumer_secret: 'HzRRJniVnAGoWcpXbT6Zez7vQvKXNhXF0pToBoo',
    access_token_key: '795307963-YAbNcpY9HG2pjaL3pIAS4Yxi89dbHLA5D2yxR1Nc',
    access_token_secret: 'i82dIsVddKkjAhknvA5MnJCUg4awb5LieehBrZauyE'
  });

  var graph = require(__dirname + '/create_graph_from_local_file.js').graph;

  graph.load(function() {
    var spk = ""
    var numberOfSentences = parseInt(1 + Math.random()*5);
    while( spk = graph.Speak(null, numberOfSentences))
    {
      if(spk.length <= 140 && spk.length >= 10) {
        break;
      }
    }
    spk = spk.replace(/[@]*velotron([ .,!;'"]+)/gi, "@velotron$1");
    spk = spk.replace(/[@]*anatomecha([ .,!;'"]+)/gi, "@anatomecha$1");

    console.log(spk);

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
