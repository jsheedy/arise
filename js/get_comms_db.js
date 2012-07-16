var startTime = (new Date()).getTime();
var url = "http://arise.velotronheavyindustries.com/communications/json/?callback=?";
var commsDb = null;
var dataWasCached = false;

if(sessionStorage.commsDb) {
  $(document).ready(function() {
      commsDb = JSON.parse(sessionStorage.commsDb);
      console.log("got data from local store!");
      dataWasCached = true;
      renderXion();
  });
} else {
  jQuery.getJSON(url, function(data) {
    $(document).ready(function() {
        commsDb=data;
        sessionStorage.commsDb = JSON.stringify(commsDb);
        renderXion();
    });
  });

}
