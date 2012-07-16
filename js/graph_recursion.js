var graph = require(__dirname + '/comms/js/create_graph_from_local_file.js').graph;

graph.load(function() {
  //console.log(graph.WordCount());
  var iters = 3060000;
  var lastCount = 0;
  for(var i=0; i<iters; i++) {
      graph.AddProse(graph.Speak());
      if(i % 100 == 0) {

         console.log(i + " / " + iters, "dLinks: ", graph.LinkCount() - lastCount); 
         lastCount = graph.LinkCount();
      }
  }

  for(var i=0; i<50; i++) {
    console.log(graph.Speak());
    console.log("------");
  }
});
