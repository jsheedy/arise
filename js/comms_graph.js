function XionGraph() {
  var graph = this;
  graph.Words = {};
  graph.FirstWords = {};
  
  graph.Word = function (word) {
    var self = this;
    self.Links = [];
    self.Word = word;
    self.RandomLink = function() {
      if (self.Links.length > 0) {
        return self.Links[Math.floor(Math.random()*self.Links.length)];
      } else {
        return null;
      }
    }
    self.possibleSentences = function() {
      var total = 0;
      if(self.Links.length>0) {
        total += self.Links.length;
        for (var i=0; i<self.Links.length; i++) {
          var w = self.Links[i];
          total += w.Links.length;
          for (var j=0; j<self.Links.length; j++) {
            var w = self.Links[j];
            total += w.Links.length;
            /*
            for (var k=0; k<self.Links.length; k++) {
              var w = self.Links[k];
              total += w.Links.length;
            }
            */
           }
        }
      }
      return total;
    }
  }
  
  
  graph.WordCount = function() {
    return Object.keys(graph.Words).length;
  }

  graph.LinkCount = function() {
    var count = 0;
    var words = Object.keys(graph.Words);

    for(var i=0; i<words.length; i++) {
      var x = graph.Get(words[i]);
      if (x) {
        count += x.Links.length;
      }
    }
    return count;
  }

  graph.RandomFirstWord = function() {
    var firstWords = Object.keys(graph.FirstWords);
    return graph.Get(firstWords[Math.floor(Math.random() * firstWords.length)]);
  }

  graph.RandomWord = function() {
    var words = Object.keys(graph.Words);
    return graph.Get(words[Math.floor(Math.random() * words.length)]);
  }

  graph.CleanupWord = function(word) {
    // xion sounds more sane without this
    // word = word.replace(/^\W+/,"").replace(/\W+$/,"");
    return word;
  }

  graph.AddWord = function(word) {
    word = graph.CleanupWord(word);
    var wordObj;
    if(graph.Words[word]) {
       return graph.Words[word];
    } else {
      wordObj = new graph.Word(word);
      graph.Words[word] = wordObj;

      if (word.match(/^[A-Z]/)) {
        graph.FirstWords[word] = word;
      }

      return wordObj;
    }
  }

  graph.AddWords = function(splitWords) {
    //$.each(splitWords, function(i, item) {
	for(var i=0; i<splitWords.length; i++) {
      var tokens = splitWords[i];
      for(var j=0; j < tokens.length-1; j++) {
        var word = tokens[j];
        var wordObj = graph.AddWord(word);
        var nextWord = tokens[j+1];
        if(wordObj.Links) {
          wordObj.Links.push(graph.AddWord(nextWord));
        }
      }
    }//);
  }
  
  var re = new RegExp(/\s+/gm);
  
  function split(body) {
    return body.trim().split(re).map(
      function(x) {
        return x.toLowerCase();
      });
  }
  
  graph.AddProse = function(s) {
    graph.AddWords([split(s)]);
  }

  graph.Get = function(word) {
    word = graph.CleanupWord(word);
    return graph.Words[word];
  }
  
  graph.Speak = function(startWord, numberOfSentences) {

    if(graph.WordCount() == 0)
      return "XionAI is offline.";
    numberOfSentences = numberOfSentences || 2;
    var word = startWord ? graph.Get(startWord) : graph.RandomWord();
    var sentence = "";
    var maxLength = 1000;
    var i = 0;
    while(word && i < maxLength) {
      sentence += word.Word + " ";
      word = word.RandomLink();
      i++;
      var dots = sentence.match(/\./g);
      if ( dots && dots.length >= numberOfSentences) {
        break;
      }
    }
    
    var x = sentence.trim();
    if (x && x.length > 0)
      return x[0].toUpperCase() + x.slice(1,x.length);
  }
}

if(exports) {
  exports.graph = new XionGraph();
} else {
  graph = new XionGraph();
}

