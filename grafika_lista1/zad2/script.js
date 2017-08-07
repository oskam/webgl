var MYAPP = {
	canvas: null,
	context: null,
	drawing_data: null,
	run_button: null,
	value1: null,
	value2: null,
	position: null,
	width: 0,
	height: 0,
	pendown: true,
	color: '#000000',
	current_line: 0,
	
	reset_values: function() {
		this.pendown = true;
		this.color = '#000000';
		this.position = { x: 5, y: 5, heading: 90}; 
	},
	init: function() {
		this.canvas = document.getElementById('canvas');
		this.value1 = document.getElementById('value1');
		this.value2 = document.getElementById('value2');
		this.run_button = document.getElementById('run');
		this.context = canvas.getContext('2d');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.position = { x: 5, y: 5, heading: 90};

		var that = this;
		this.run_button.onclick = function() {
			that.reset_values();
			var iteration = that.value1.value;
			var length = that.value2.value;
			that.leftHilbert(iteration, length);//iteration, length
		}
	},

	leftHilbert: function(l, w) {
	    if (l === 0) {
	        return;
	    }
	    this.RIGHT(90);
	    this.rightHilbert(l - 1, w);
	    this.FORWARD(w);
	    this.LEFT(90);
	    this.leftHilbert(l - 1, w);
	    this.FORWARD(w);
	    this.leftHilbert(l - 1, w);
	    this.LEFT(90);
	    this.FORWARD(w);
	    this.rightHilbert(l - 1, w);
	    this.RIGHT(90);
	},

	rightHilbert: function(l, w) {
	    if (l === 0) {
	        return;
	    }
	    this.LEFT(90);
	    this.leftHilbert(l - 1, w);
	    this.FORWARD(w);
	    this.RIGHT(90);
	    this.rightHilbert(l - 1, w);
	    this.FORWARD(w);
	    this.rightHilbert(l - 1, w);
	    this.RIGHT(90);
	    this.FORWARD(w);
	    this.leftHilbert(l - 1, w);
	    this.LEFT(90);
	},


	BACK: function(distance) {//BK
		//moves turtle opposite direction
		this.FORWARD(-distance);
	},

	CLEARGRAPHICS: function() { //CG
		//clears current graphics, puts turtule home
		this.context.fillStyle = '#ffffff';
		this.context.fillRect(0,0,this.width,this.height);
		this.position = { x: 5, y: 5, heading: 90};//Object.create(this.home);
	},
	FORWARD: function(distance) { //FD
		//moves turtule forward
		var newX = this.position.x + distance*Math.cos(this.position.heading*Math.PI/180);
		var newY = this.position.y + distance*Math.sin(this.position.heading*Math.PI/180);
		if(this.pendown) {
			//set canvas so it has no turtle
			//this.context.putImageData(this.drawing_data,0,0);
			//then draw on turtle cruftless canvas
			this.context.strokeStyle = this.color;
			this.context.beginPath();
			this.context.moveTo(this.position.x, this.height - this.position.y);
			this.context.lineTo(newX, this.height - newY);
			this.context.stroke();
		}
		this.position.x = newX;
		this.position.y = newY;
	},

	LEFT: function(deg) { //LT
		//turns left specified number of degrees
		this.position.heading += deg;
	},
	
	PENDOWN: function() { //PD
		//puts pendown
		this.pendown = true;
	},
	
	PENUP: function() { //PU
		//raises pen
		this.pendown = false;
	},
	RIGHT: function(deg) { //RT
		//turns turtle to the right specified number of degrees
		this.position.heading -= deg;
	},
	SETHEADING: function(deg) { //SETH
		//turns turtle to the right specifed number of degrees
		this.position.heading = deg;
	},
	SETPENCOLOR: function(color) { //SETPC
			this.color = color;
	},

};
