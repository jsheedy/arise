// only run every once in a while, schedule every minute from cron.
if(Math.random() > 0.035) {
  console.log("exiting");
  process.exit(code=0);
} else {
  sleeptime = Math.random() * 60 * 5 * 1000;
  console.log("continuing in seconds: " +  sleeptime);
  setTimeout(post, sleeptime)
}

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
    while( spk = graph.Speak())
    {
      if(spk.length <= 140) {
        break;
      }
    }

    console.log(spk);

    twit.updateStatus(spk,
        function (err, data) {
          console.log("data: ");
          console.log(data);
          console.log("err: ");
          console.log(err);
        }
    );
  });

}
