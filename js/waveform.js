
var Waveform = function(container, channel) {
  var self = this;
  self.data = new Array();
  var w = container.width();
  //var w = 400;
  var h = 100;
  var scale = 3.0;
  var canvas = $("<canvas width='"+w+"' height='"+h+"' class='env' id='env" + channel + "'>");
  container.append(canvas);
  
  self.canvas = canvas;
  self.context = canvas.get()[0].getContext('2d');
  var context = self.context;
  
  var lingrad = context.createLinearGradient(0,0,0,100);
  lingrad.addColorStop(0, '#f80');
  lingrad.addColorStop(1, '#cfc');
  
  
  self.Update = function(value) {
    self.data.push(value);
    if(self.data.length > w/scale) {
      self.data.shift();
    }
    context.fillStyle = 'black';
    context.fillRect(0, 0, w,h);
    context.fillStyle = lingrad;
    
    //context.fillStyle = 'red';
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "#fff";
    context.moveTo(0, h/2.0);
    for(var i=0; i<self.data.length; i++) {
      var height = h - (h * self.data[i]);
      context.lineTo(i*scale,height);
    }
    context.fill();
    context.closePath();
    context.stroke();
  }
};