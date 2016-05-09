(function() {
  var MAX_TEXT = 50000;
  var expat = require('node-expat');
  var fs = require('fs');
  var pg = require('pg'); 
  var htmlparser = require("htmlparser");
  var zlib = require('zlib');
  var gunzip = zlib.createGunzip();

  var redis = require("redis"),
      client = redis.createClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });

  var conString = "tcp://velotron@localhost/wiki";

  function removeRefs(text) {
    var output = "";
    var handler = new htmlparser.DefaultHandler(function(err,dom) {
      if(!err) {
        for(var i=0; i<dom.length;i++) {
          if (dom[i].type == "text") {
            output += dom[i].data;
          }
        }
        
      }
    });
    var parser = new htmlparser.Parser(handler);

    parser.parseComplete(text);
    return output;
  }

  function cleanText(text) {
    var SIMPLE_MARKUP_RE = new RegExp(/(\'\'\')|(\|)/gm);
    var JUST_THE_INTRO_RE = new RegExp(/(==[\s\S]*$)/gm);
    var stack = new Array();
    var newTxt = "";
    var idx=0;

    text = text.replace(JUST_THE_INTRO_RE,'');
    
    // remove squigglies
    for(var i=0; i<text.length-1; i++ ) {
      if(text[i] == "{" && text[i+1] == "{") {
        stack.push(i);
      }
      if(text[i] == "}" && text[i+1] == "}") {
        var index = stack.pop(); 
        if(stack.length == 0) {
          newTxt += text.slice(idx,index);
          idx = i+2;
        } 
      }
    }

    newTxt = removeRefs(newTxt);

    text = newTxt;
    newTxt = "";
    stack = new Array();
    idx = 0;

    // remove square bracket links 
    for(var i=0; i<text.length-1; i++ ) {
      if(text[i] == "[" && text[i+1] == "[") {
        stack.push(i);
      }
      if(text[i] == "]" && text[i+1] == "]") {
        var index = stack.pop(); 
        if(stack.length == 0) {
          var slice = text.slice(idx,index);
          var content = text.slice(index+2,i);
          newTxt += slice;

          var pipe = content.indexOf('|');
          if(pipe >= 0) {
            var title = content.slice(pipe+1);
            newTxt += title;
          } else {
            newTxt += content;
          }
          idx = i+2;
        } 
      }
    }
    newTxt += text.slice(idx);

    return newTxt.replace(SIMPLE_MARKUP_RE,'').trim();
  }


  var fname = __dirname + "/../../../wikipedia/enwiki-latest-pages-articles.xml";
  var fname = "/Volumes/Macintosh\ HD/wikipedia/enwiki-latest-pages-articles.xml.gz";
  //var fname = "/tmp/bad";
  var inTitle = false;
  var inText = false;
  var title = "";
  var text = "";
  var dupe = false;

  var p = new expat.Parser("UTF-8");

  p.on('startElement', function(name) {
    if (name == "title") {
      inTitle = true;
      title = "";
    } else if (name =="text") {
      inText = true; 
      text = "";
    }
  });

  p.on('endElement', function(name) {
    if(name == "title") {
      inTitle = false;
      dupe = p.existingTitles[title];
    } else if (name =="text") {
      inText = false;
      if (dupe ) {
        console.log("dupe? : " + title);
        return;
      }
      else if (text.match(/^#REDIRECT/)){
        return;
      } else if(text.length > MAX_TEXT ) {
// if ( title.match(/^Wikipedia:Upload/) || 
        console.log("too long : " + title);
        text = text.slice(0,MAX_TEXT);
      }
      text = cleanText(text);
      //var client = p.client;
      //(
        //function() {
        var tit = title.trim();
        var tex = text;
        client.set(tit, tex);
        //pg.connect(conString, function(err, client) {
/*
          var query = client.query("INSERT INTO wiki (title, content) VALUES ($1,$2)", [tit, tex], function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("inserted " + tit);
            }
          });
*/
        //});
      //})();
    }
  });

  p.on('text', function(data) {
    if(inTitle) {
      title += data;
    } else if (inText) {
      if(text.length < MAX_TEXT) {
        text += data;
      }
    }
  });

  client.keys("*", function(err,rep) {
    p.existingTitles = {};
    for(var i=0; i<rep.length; i++) {
      p.existingTitles[rep[i]] = true;
    }
    console.log("got existing : " + p.existingTitles.length);
    console.log("first title : " + p.existingTitles[0]);
    fs.createReadStream(fname).pipe(gunzip).pipe(p);
  });
/*
  pg.connect(conString, function(err, client) {
    client.query("SELECT title from wiki", function(err, result) {
      if (err) {console.log(err);}
      for(var i=0; i<result.rows.length; i++) {
        p.existingTitles[result.rows[i]['title']] = true;
      }
    });
    p.client = client;
    fs.createReadStream(fname).pipe(gunzip).pipe(p);

  });
*/

  //fs.createReadStream(fname).pipe(p);

})();
