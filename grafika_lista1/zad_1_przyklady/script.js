var MYAPP = {
	canvas: null,
	context: null,
	drawing_data: null,
	command_text_area: null,
	run_button: null,
	position: null,
	width: 0,
	height: 0,
	pendown: true,
	color: '#000000',
	current_line: 0,

	reset_values: function() {
		this.pendown = true;
		this.color = '#000000';
		this.position = { x: (this.width/2), y: (this.height/2), heading: 90}; //Object.create(this.home); //this.home obiekt, na podstawie którego ma zostać utworzony nowy (protoyp)
		this.CLEARGRAPHICS();
	},
	
	init: function() {
		this.canvas = document.getElementById('canvas');
		this.command_text_area = document.getElementById('commands');
		this.run_button = document.getElementById('run');
		this.context = canvas.getContext('2d');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.position = { x: (this.width/2), y: (this.height/2), heading: 90};


		this.house();
		this.star();
		this.something();
	},
	
	house: function (){
		this.FORWARD(50);
		this.RIGHT(90);
		this.SETPENCOLOR('red');
		this.BACK(10);
		this.LEFT(45);
		this.FORWARD(60);
		this.LEFT(90);
		this.BACK(60);
		this.LEFT(45);
		this.FORWARD(10);
		this.LEFT(90);
		this.SETPENCOLOR('black');
		this.FORWARD(50);
		this.RIGHT(90);
		this.FORWARD(65);
	},

	star: function(){
		this.SETPENCOLOR('#994c00');
		this.position = {x: 200, y: (this.height/2), heading: 145};
		for (var i=1; i<=30; i++){
			this.FORWARD(i*10);
			this.RIGHT(144);
		}
	},

	something: function(){
		this.SETPENCOLOR('#4c0099');
		this.position = {x: 700, y: (this.height/3.5), heading: 90};

		for (var i=1; i<=50; i++){
			this.FORWARD(200);
			this.LEFT(123);
		}
	},	
	BACK: function(distance) {//BK
		//moves turtle opposite direction
		this.FORWARD(-distance);
	},

	CLEARGRAPHICS: function() { //CG
		//clears current graphics, puts turtule home
		this.context.fillStyle = '#ffffff';
		this.context.fillRect(0,0,this.width,this.height);
		this.position = { x: (this.width/2), y: (this.height/2), heading: 90};//Object.create(this.home);
	},
	FORWARD: function(distance) { //FD
		//moves turtule forward
		var newX = this.position.x + distance*Math.cos(this.position.heading*Math.PI/180);
		var newY = this.position.y + distance*Math.sin(this.position.heading*Math.PI/180);
		if(newX < 0 || newX >= this.width || newY < 0 || this.newY >= this.height) {
			return;
		}
		if(this.pendown) {
			//set canvas so it has no turtle
			//this.context.putImageData(this.drawing_data,0,0);
			//then draw on turtle cruftless canvas
			this.context.strokeStyle = this.color;
			this.context.beginPath();
			this.context.moveTo(this.position.x, this.height - this.position.y);
			this.context.lineTo(newX, this.height - newY);
			this.context.stroke();
			//save new turtleless canvas
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
