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
		var that = this;
		this.run_button.onclick = function() {
			that.reset_values();
			that.run_commands(that.command_text_area.value);
		}
	},
	
	run_commands: function(unparsed) {
		var lines = unparsed.split('\n');
		var chunks = null;
		for(this.current_line = 0; this.current_line < lines.length; this.current_line++) {
			chunks = lines[this.current_line].trim();
			if(chunks === '') {
				continue;
			}
			chunks = chunks.split(/\s+/g);
			chunks[0] = chunks[0].toUpperCase();
			switch (chunks[0]) {
			case 'FORWARD':
			case 'FD':
				this.FORWARD(parseInt(chunks[1]));
				break;
			case 'BACK':
			case 'BK':
				this.BACK(parseInt(chunks[1]));
				break;
			case 'CG':
			case 'CLEARGRAPHICS':
				this.CLEARGRAPHICS();
				break;
			case 'PENDOWN':
			case 'PD':
				this.PENDOWN();
				break;
			case 'PENUP':
			case 'PU':
				this.PENUP();
				break;
			case 'LEFT':
			case 'LT':
				this.LEFT(parseInt(chunks[1]));
				break;
			case 'RIGHT':
			case 'RT':
				this.RIGHT(parseInt(chunks[1]));
				break;
			case 'SETHEADING':
			case 'SETH':
				this.SETHEADING(parseInt(chunks[1]));
				break;
			case 'SETPENCOLOR':
			case 'SETPC':
				this.SETPENCOLOR(chunks[1]);
				break;
			default:
				return;
			}
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
		this.position = { x: (this.width/2), y: (this.height/2), heading: 90};
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
