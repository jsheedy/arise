
function sketch(processing) {
	
	
	var col;
	var x,y;
	var w,h;
			var col = 0;
	var Cell = function(tempX, tempY) {
		var self = this;
		var x = tempX;
		var y = tempY;
		var w = 2;
		var h = 20;



		self.display = function() {
			processing.stroke(255);
			processing.fill(col % 255);
			//col = parseInt(Math.random()*255);
			col++;
			processing.rect(x,y,w,h);
		}
	}
	
	var self = this;
	//Cell[][] grid;

	
	processing.setup = function() {
		processing.size(1900,500);
		processing.frameRate(24);
		//processing.colorMode(processing.RGB, 100);
		/*
		grid = [];
		for(var i=0; i<cols; i++) {
			grid.push([]);
			for (var j=0; j<rows; j++) {
				grid[i].push(new Cell(20*i,20*j));
				
				//grid[i][j] = new Cell();
			}
		}
		*/
		
	}
	self.drawFFT = function() {
		for(var i=0; i<cols; i++) {
			for (var j=0; j<rows; j++) {
				//processing.stroke(255);
				if(grid[i][j].length) {
					processing.fill(grid[i][j][0], grid[i][j][1],grid[i][j][2]  );	
				} else {
					processing.fill(grid[i][j]);	
				}

				//col = parseInt(Math.random()*255);
				//col++;
				processing.rect(i*20,j*20,20,20);
				//grid[i][j].display();
			}
		}
	}
	processing.draw = function() {
		self.drawFFT();
	}

}

var fftP = null;
function fftProcessing() {
	var canvas = $("canvas").get(0);
	 fftP = new Processing(canvas, sketch);
	
}