var graph = require(__dirname + '/../js/create_graph_from_local_file.js').graph;

graph.load(function() {
  console.log(graph.Speak());
});
