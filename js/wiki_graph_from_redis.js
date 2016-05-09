var graph = require(__dirname + '/create_graph_from_redis.js').graph;

graph.load(function() {
    console.log(graph.Speak());
});
