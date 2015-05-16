var startTime = (new Date()).getTime();
var url = "http://arise.velotronheavyindustries.com/communications/json/?callback=?";
var commsDb = null;
var dataWasCached = false;

var re = new RegExp(/\s+/gm);

function split(body) {
  return body.trim().replace(/\s+>/gm, " ").replace(/[\r\n ]+/gm, " ").split(re).map(
    function(x) {
      return x.toLowerCase();
    });
}

var populateGraph = function(data) {
  for (var i=0; i<commsDb.length; i++) {
    var item = commsDb[i];
    var tokens = split(item.subject + " " + item.body);
    graph.AddWords([tokens]);
  }
  document.dispatchEvent(graphReadyEvent);
};


if(sessionStorage.commsDb) {
  $(document).ready(function() {
      commsDb = JSON.parse(sessionStorage.commsDb);
      console.log("got data from local store!");
      dataWasCached = true;
      populateGraph();
      // renderXion();
  });
} else {
  jQuery.getJSON(url, function(data) {
    $(document).ready(function() {
        commsDb=data;
        sessionStorage.commsDb = JSON.stringify(commsDb);
        // renderXion();
        populateGraph();
    });
  });

}
