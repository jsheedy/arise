var XionSpectrogram = function(container) {
  var self = this;
  var bands = [];
  self.nBands = 25;
  var height = container.height();
  var width = container.width();

  // create bands
  for (var i=0; i<self.nBands; i++) {
		var d = $('<div class="fftband">');
		d.attr("id", "fft-"+i);
		d.css("width", width * 1.0 / self.nBands - 2);
		d.css("height", height-1);
		bands.push(d);
		container.append(d);
	}

  self.Update = function(data) {
    
    if(data.length != self.nBands) { throw new Exception("wrong number of bands in data: " + 
                                                    data.length + " expected "+ self.nBands);}
    for (var i=0; i<self.nBands; i++) {
  		var value = data[i];
  		var bar = bands[i];
  		//var h = (value+50)*4;
  		var h = value * height; //normalized
  		if (h < 10)
  			h = 0;
  		if (h > height)
  		  h = height;
  		bar.css("margin-top", height-h);
  	}
  }
}

var bgImage = new Image();
bgImage.src = "images/anatomecha_with_pyramids.png";

var XionSpectrumCanvas = function(canvas) {
  var self = this;
  self.canvas = canvas;
  self.context = canvas.getContext('2d');
  var context = self.context;
  
  var width = context.canvas.width;
  var height = context.canvas.height;

  var bands = [];
  self.nBands = 25;
  
  var barWidth = width * 1.0 / self.nBands;
  
  
  var Data = new Array(self.nBands);

  var timeout = null;
  
  var lingrad = context.createLinearGradient(0,0,0,100);
  lingrad.addColorStop(0, '#f80');
  lingrad.addColorStop(1, '#cfc');

  
  self.DrawSpectrum = function() {
    var data = Data;
    //context.drawImage(bgImage,-200 + Math.random()*10,-500 + Math.random()*5);
    context.fillStyle = 'black';
    context.fillRect(0,0,width, height);
    context.fillStyle = '#fe0';
    context.fillStyle = lingrad;

    for (var i=0; i<self.nBands; i++) {
      var value = data[i];
      if(value > 0) 
        value = 0;
      
      var h = Math.exp(value / 20.0) * height;
      var x = i*barWidth;
      var y = height - h;
      context.fillRect(x, y, barWidth-2,h);
      if(i==0) {
        // context.beginPath();
        // context.moveTo(x + barWidth/2.0,y);
      } else {

        /*http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
        // move to the first point
           ctx.moveTo(points[0].x, points[0].y);


           for (i = 1; i < points.length - 2; i ++)
           {
              var xc = (points[i].x + points[i + 1].x) / 2;
              var yc = (points[i].y + points[i + 1].y) / 2;
              ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
           }
         // curve through the last two points
         ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
         */
        // context.quadraticCurveTo(x+barWidth, y+1,x + barWidth/2.0,y);
      }

    }
    // context.lineJoin = "round";
    // context.lineCap = "round";
    // context.lineWidth = 5;
    // context.strokeStyle = "#fff";
    // context.stroke();
  }
  self.Update = function(data) {
    if(data.length != self.nBands) { throw "wrong number of bands in data: " + data.length + " expected "+ self.nBands + " data: " + data;}
    Data = data;
    self.DrawSpectrum();                                                
  }
}