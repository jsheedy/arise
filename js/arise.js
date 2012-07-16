// var url = "http://arise.velotronheavyindustries.com/communications/json/?freqs=1&callback=?";

function isMobile() {
  return screen.width < 500 ||
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i);
    //alert("This is a mobile device");
}

function addHaiku() {
  $('#haiku-pipe').html(generateHaiku(words));
  setTimeout(addHaiku, 50 + Math.random() * 50);
}

function handleFreqs(splitWords) { 
  var words = {};
  $.each(splitWords, function(i, r) {
    for(var i=0; i<r.length; i++) {
      var word = r[i];
      if(words[word]) {
        words[word]++;
      } else {
        words[word] = 1;
      }
    }
  });
    var freqsData = [];
    $.each(Object.keys(words), function(i,key) {
      if (words[key] > 2 && !bad_word(key)) {
        freqsData.push([key, words[key]]);
        //$('#freqspoem').append(key + " ");
      }
    }); 
  freqfall(freqsData);
}
var bad_words = ["have", "just", "into", "cant", "than", "there", "about", "which", "with", "that", "this", "from", "the", "is" , "will", "when","like", "into", "your", "could", "these" ];
var bad_words_dict = {};
for(var i=0; i<bad_words.length; i++) {
  bad_words_dict[bad_words[i]] = true;
}
function bad_word(word){
  if (word.length < 4) {
      return true;
  } else {
    return bad_words_dict[word];
  }
}
var re = new RegExp(/\s+/gm);

function split(body) {
  return body.trim().split(re).map(
    function(x) {
      return x.toLowerCase();
    });
  //return body.trim().split(re);
}
function bodyToSpans(body) {
  // parse up body into spans that we can handle clicks
  var newBody = ""
  body = body.replace(/[\n\r]+/g, " __NEWLINE__");
  //body = body.replace(/[\n\n]+/g, " __NEWLINE__");
  var words = split(body);
  for(var i=0; i<words.length; i++) {
    var word = words[i];
    var br = "";
    if (word.match("__newline__")) {
      br = "<br /> "; 
      word = word.replace(/__newline__/g," ") 
    }
    newBody += "<span class='word'>" + word + "</span> " + br;
  }
  return newBody;
}

function fillTemplate(row,data) {
  if(data.id) {
    row.find(".link")
      .attr('href', "/communications/" + data.id)
      .attr('name', data.id);
    row.attr('id', 'message-' + data.id);
  }
  row.find(".sender").text(data.name);
  row.find(".datetime").text(data.datetime);
  row.find(".subject").text(data.subject);
  if(data.body.length > 0) {
      row.find(".body")[0].innerHTML = bodyToSpans(data.body);
  }
  row.addClass(data.name);
  if (data.subject.toLowerCase().slice(0,3) == "re:") {
    row.addClass('reply');
  }
  return row;
}

function makeLine(words, syllables) {
  var line = "";
  while(line.length < syllables * 3) {
    var rand = parseInt(Math.random() * words.length);
    line += words[rand] + " ";
  }

  return line;
}
function generateHaiku(words) {
  var line1 = makeLine(words,5);
  var line2 = makeLine(words,7);
  var line3 = makeLine(words,5);
  var haiku = $('<div>');
  haiku.addClass('haiku');

  haiku.append(line1 + "<br />");
  haiku.append(line2 + "<br />");
  haiku.append(line3 + "<br />");

  return(haiku);
}

function appendHaiku() {
          if (Math.random() > .9 && words.length > 0) {
          newRow = $('#communications .template').clone().removeClass('template');
            item = {name: 'xion', datetime: '3.06e09a', subject: 'ARISE', body: generateHaiku(words).html()};
            fillTemplate(newRow, item)
              .appendTo('#communications');
              }
}

function getStats()
{
    var stats = $('#stats');
    var table = $('<table>');

    var endTime = (new Date()).getTime();
    var elapsed = endTime - startTime;

    var row = $('<tr>');
    row.append("<th colspan='2'>Velotron Arise</th>");
    table.append(row)

    var row = $('<tr>');
    row.append("<td>Status : </td>");
    row.append("<td>Xion AI online</td>");
    table.append(row)

    var row = $('<tr>');
    row.append("<td>initialization time : </td>");
    row.append("<td>" + elapsed + "ms</td>");
    table.append(row);

    var row = $('<tr>');
    row.append("<td>sessionData cached : </td>");
    row.append("<td>" + dataWasCached + "</td>");
    table.append(row);

    var row = $('<tr id="totalMessagesCount">');
    row.append("<td>total messages integrated: </td>");
    row.append("<td class='countdata'>" + commsDb.length + "</td>");
    table.append(row);

    var row = $('<tr id="totalWordTokensCount">');
    row.append("<td>word tokens learned: </td>");
    row.append("<td class='countdata'>" + graph.WordCount() + "</td>");
    table.append(row);

    var row = $('<tr id="totalLinksInGraphCount">');
    row.append("<td>total links in graph network: </td>");
    row.append("<td class='countdata'>" + graph.LinkCount() + "</td>");
    table.append(row);

    var row = $('<tr id="wikistats">');
    table.append(row);
  
    stats.append(table);
    generateWikiStats();

    var flot = $("<div id='flot' style='width:300px; height:120px;'>");
    stats.append(flot);

    //$.plot(flot, metricsData );
        //whoa, 37337
    $.plot(flot, (function(data) {
      var z = [];
      for(var i=0; i<data[0].length; i++) {
        z.push([data[0][i][0],data[0][data.length-1][1] * data[1][i][1] / data[0][i][1] ]); 
      }
      return [data[0],data[1],z];
    })(metricsData) );
}
function generateTotalMessagesCount() {
  $('#totalMessagesCount .countdata').html(commsDb.length);
}
function generateTotalWordTokensCount() {
  $('#totalWordTokensCount .countdata').html(graph.WordCount());
}
function generateTotalLinksInGraphCount() {
  $('#totalLinksInGraphCount .countdata').html(graph.LinkCount());
}
function generateWikiStats() {
    var wikiCount = 0;
    $.each(Object.keys(localStorage), function(i,item) {
      if (/^wikipedia-/.test(item)) {
        wikiCount++;
      }
    });
    var row = $('#wikistats');
    row.html("");
    row.append("<td>wikipedia definitions cached: </td>");
    row.append("<td>" + wikiCount + "(" + (wikiCount / graph.WordCount() * 100).toFixed(2) + "%)" + ' <a href="javascript:localStorage.clear()">(clear)</a>' + ' <a href="javascript:mergeWiki()">(merge)</a>' +"</td>");
}
function stripTags(txt) { 
  return txt.replace(/<\/?[^>]+>/gi, ' '); 
}
//jQuery.fn.stripTags = function() { return this.replaceWith( this.html().replace(/<\/?[^>]+>/gi, '') ); };

function mergeWiki() {
    try {
    $.each(Object.keys(localStorage), function(i,item) {
      if (/^wikipedia-/.test(item)) {
        var content = localStorage[item];
        if(!content || content.toUpperCase() == "(NULL)") {
          return;
        }
        var ps=[];
        $.each($(content),function(i,item) {
          if (item.tagName == "P") {
            ps.push(item.innerHTML);
        } 
        });
        content = ps.join(" ");
      if(content.length < 10) {
          return;
        }
        var text = stripTags(content);
        var words = [split(text)];
        graph.AddWords(words);
      }
    });
    generateTotalMessagesCount();
    generateTotalWordTokensCount();
    generateTotalLinksInGraphCount();

    } catch (err) {
      alert(err);
    }
}

function replaceWithXionMessage(e, replacementWord) {
    var word = replacementWord ? graph.Get(replacementWord) : graph.RandomWord();
    //var word = replacementWord ? graph.Get(replacementWord) : graph.RandomFirstWord();
    var sentence = "";
    var maxLength = 500;
    var i = 0;
    while(word && i < maxLength) {
      sentence += " " + word.Word;
      word = word.RandomLink();
      i++;
    }
    if(isMobile()) {
      e[0].innerHTML = sentence;
    } else {
      e[0].innerHTML = bodyToSpans(sentence);
    }
}

function populateXion() {
  $.each( $(".message.xion .body"), function(i,x) {
    replaceWithXionMessage($(x));
  });
}

function displayMessages(fromId,all) {
  var template = $('#communications .template').clone().removeClass('template');
  var messagesPerPage = 30;
  if(all) {
    var messagesPerPage = 37337;
  }
  if(!fromId) {
    fromId = 37337;
  }
  var lastId = 0;
  var messagesAdded = 0;
  $.each(commsDb, function(i,item) { 
    if(item.id < fromId && messagesAdded < messagesPerPage) {
      fillTemplate(template.clone(), item).appendTo('#communications');

      if(Math.random() > .6) {
        var xitem = {name: 'xion', datetime: '3.06e09a', subject: 'ARISE', body: ""};
        fillTemplate(template.clone(), xitem).appendTo('#communications');
      }
      lastId = item.id;
      messagesAdded++;
    }
   });

    $('#communications').append($('<a class="msgLinks" onclick="' + "$('.msgLinks').hide()" + '" href="javascript:displayMessages(' + lastId + ');">moar</a>'));
    $('#communications').append($('<p class="msgLinks" style="height: 10px;"><a onclick="' + "$('.msgLinks').hide()" + '" href="javascript:displayMessages(' + lastId + ',1);">all</a></p>'));
    populateXion();
    if(fromId != 37337) {
      $('html,body').animate({scrollTop: $("#message-"+fromId).offset().top},'slow');
    }
}
var metricsData = [[],[]];
function renderXion() { 
    var w = [];
    $.each(commsDb, function(i,item) {
      var tokens = split(item.subject + " " + item.body);
      graph.AddWords([tokens]);
      metricsData[0].push([i, graph.WordCount()]);
      metricsData[1].push([i, graph.LinkCount()]);
      //return [d1, d2];
      w.push(tokens);
    });
    metricsData[0].reverse();
    metricsData[1].reverse();

    displayMessages();
    populateXion();
    handleFreqs(w);
    getStats();
    setWidthAndHeight();

    //$("#communications").autolink();
    //$("#communications").highlight("arise", '<span style="font-style: italic; font-variant: small-caps; font-size: 1.1em;">$1</span>');
    $('#container').on('click', '.message .body .word', function(e) {
      var word = $(this).html();
      var parent = $($(this).parent());
      replaceWithXionMessage(parent, word);
    });
    if(!isMobile()) {

    $('#container').on('hover', '.message .body .word', function(e) {
      var word = $(this).html();
      try {
        getWikipedia(word,e);
      } catch (err) { console.log("wikipedia failed to find " + word);
      }
      var wordObj = graph.Get(word);
      if(wordObj) {
        var w = $('#messagedata');

        var headerHeight = $('#header').height()+10;
        if (window.pageYOffset > headerHeight) {
          w.css("top",  window.pageYOffset - headerHeight );
        } else {
          w.css("top", 0 );
        }

        w.html("<b>"+word+"</b><br />" + 
          "possible paths: " + wordObj.Links.length + "<br />" +
          "sentences to Z:2: " + wordObj.possibleSentences() + "<br />"
          );
          //"<a href='javascript:getWikipedia(" + '"'+word+'"' + ")'>wikipedia</a>"
        var p = $('<p style="width: 180px">');
        replaceWithXionMessage(p, word);
        w.append(p);
      }
    });
    } // isMobile()
} // renderXion()
function getWikipedia(s, e) {
  var pageName=s.replace(/[.,:?!'"\s]+/g,"");
  var key="wikipedia-"+pageName;

  var headerHeight = $('#header').height()+10;
  if (window.pageYOffset > headerHeight) {
    $('#wikipedia').css("top",  window.pageYOffset - headerHeight );
  } else {
    $('#wikipedia').css("top",  0 );
  }
  if(localStorage.getItem(key)) {
    console.log("got cached wikipedia for " + pageName);
    $('#wikipedia').html(localStorage.getItem(key));
  } else {
    console.log("retrieving data from wikipedia for " + pageName);
  $.getJSON("http://en.wikipedia.org/w/api.php?action=parse&format=json&callback=?", {page
  :pageName, prop: "text"}, function(result) {
    if (localStorage.getItem(key) == "") {
      return;
    }
    localStorage.setItem(key, "");
    if(!result.parse || !result.parse.text) {
      return;
    }
    var rawContent = result.parse.text['*'];
    content = $(rawContent); 
    // doesn't work: content = content.find("p:first");
    var ps = [];
    $.each(content,function(i,item) {
      if (item.tagName == "P" ||
          item.tagName == "UL" || 
          item.tagName == "OL") {
        ps.push(item.outerHTML);
      } else if (item.tagName == "OL") {
        if(item[0][0]) {
        }
        /*
        TODO: if ol looks like this, pull down redirect
        <ol>​
        <li>​
        "REDIRECT "
        <a href=​"/​wiki/​Infinity" title=​"Infinity">​infinity​</a>​
        </li>​
        </ol>​
        */
      }
    });
    var max = ps.length;
    if (max > 4) {
      max = 4;
    }
    content = "";
    for(var i=0; i<max; i++ ){
      content += ps[i];
    }
    if(ps.length == 0) {
      content = "(null)";
    }
      $('#wikipedia').html(content);
      localStorage.setItem(key, content);
      generateWikiStats();
  });
  }

}

function setWidthAndHeight() {
  var width = $('body').width(); 
  var height = 500;
  $('#canvas').width(width); 
  $('#canvas').height(height); 
  if(freqFall) {
    freqFall.size(width, height);
  }
}

$(window).resize(setWidthAndHeight);
