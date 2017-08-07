/* SHADER PROGRAM */
/* vertex shader source code */
var vertCode= ''+
    'attribute vec4 aVertexPosition; \n'+
    'uniform vec3 uMove; \n'+
    'void main(void) { \n'+
    '  gl_PointSize = 16.0; \n'+
    '  gl_Position = aVertexPosition + vec4( uMove, 0); \n'+
    '} \n';

/* fragment shader source code */
var fragCode = ''+
    'precision mediump float; \n'+ 
    'uniform vec3 uColorRGB; \n'+ 
    'void main(void) { \n'+
    '  gl_FragColor = vec4( uColorRGB, 1.0 ); \n'+
    '} \n';



var gl;
var glObjects;
var html;
var data;

var glInit= function(canvas) {
    gl = canvas.getContext('experimental-webgl');
    // gl.viewport tells WebGL how to convert from clipspace (-1 to +1)
    // back to pixels and where to do it within the canvas.
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    // Passes if the fragment's depth value is less than or equal to the stored depth value.
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    glObjects = {};

    // Create and compile Shader programs 
    glObjects.shaderProgram = createShaderPrograms( gl, vertCode, fragCode );
    // Get the attribute location
    glObjects.aVertexPositionLocation = gl.getAttribLocation(glObjects.shaderProgram, 'aVertexPosition');
    // Uniform variables are used to communicate with your vertex or fragment shader from "outside",
    // act as constants
    glObjects.uMoveLocation = gl.getUniformLocation(glObjects.shaderProgram, 'uMove');
    glObjects.uColorRGBLocation = gl.getUniformLocation(glObjects.shaderProgram, 'uColorRGB');

};


var createShaderPrograms = function ( gl, vertShaderSource, fragShaderSource ){
    //Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    //Attach vertex shader source code
    gl.shaderSource(vertShader, vertShaderSource);
    //Compile the vertex shader
    gl.compileShader(vertShader);

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragShaderSource);
    // Compile the fragment shader
    gl.compileShader(fragShader);

    // Create a shader program object to store combined shader program
    var shaderProgram = gl.createProgram();
    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);
    // Link both programs
    gl.linkProgram(shaderProgram);

    return shaderProgram;
};

var dataInit= function(){
    data = {};
    data.background = [0.0, 0.5, 0.5,1];

    // PLAYER
    data.playerObject = {};
    data.playerObject.direction = [-1,0,0];
    data.playerObject.position = [0,-.9,-1];
    data.playerObject.colorRGB = [1.0, 1.0, 1.0];

    // Create a new buffer object for player
    data.playerObject.bufferId = gl.createBuffer();
    // Bind an empty array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, data.playerObject.bufferId );
    // Pass the vertices data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array([
                            -.1,0,
                            .1,0,
                            -.1,-.05,
                            .1,-.05
                        ]) , gl.STATIC_DRAW ); 

    data.playerObject.floatsPerVertex = 2;
    data.playerObject.NumberOfVertices = 4;
    data.playerObject.drawMode = gl.TRIANGLE_STRIP;


    // BALL
    data.ballObject={};
    data.ballObject.speed = 0.001;
    data.ballObject.direction = [0,0,0];
    data.ballObject.position = [0,0,0];
    data.ballObject.colorRGB = [1.0, 1.0, 1.0];

    // Create a new buffer object for ball
    data.ballObject.bufferId = gl.createBuffer();
    // Bind an empty array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, data.ballObject.bufferId );
    // Pass the vertices data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([0,0]) 
            , gl.STATIC_DRAW );

    data.ballObject.floatsPerVertex=2;
    data.ballObject.NumberOfVertices=1;
    data.ballObject.drawMode=gl.POINTS;


    // BACKGROUND -> FIELD
    data.fieldObject={};
    data.fieldObject.position=[0,0, 0.7];
    data.fieldObject.colorRGB=[1, 0.9, 0.6];

    data.fieldObject.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.fieldObject.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -.9,  .9, 
        				      .9,  .9, 
        				      .9,  -.9,
        				      -.9, -.9
                            ] ) , gl.STATIC_DRAW ); 

    data.fieldObject.floatsPerVertex=2;
    data.fieldObject.NumberOfVertices=4;
    data.fieldObject.drawMode=gl.TRIANGLE_FAN;

    // BACKGROUND -> LINES
    data.linesObject={};
    data.linesObject.position=[0,0, 0.6];
    data.linesObject.colorRGB=[.9, 0, 0];

    data.linesObject.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.linesObject.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, 
		new Float32Array([
                            -.9, -.2,
                            -.9, .9, 
                			.9, .9, 
                		    .9, -.2,
                		    .9, -.9, 
                			-.9, -.9,
                		    -.9, -.2,
                            .9, -.2
                        ] ) , gl.STATIC_DRAW ); 

    data.linesObject.floatsPerVertex=2;
    data.linesObject.NumberOfVertices=8;
    data.linesObject.drawMode=gl.LINE_STRIP;

    // ANIMATION
    data.animation={};
    data.animation.requestId=0;

}

var redraw = function() {
    var bg = data.background;
    // Clear screen color
    gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
    // COLOR_BUFFER_BIT -> indicates the buffers currently enabled for color writing.
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw objects
    drawObject(data.playerObject);
    drawObject(data.ballObject);
    drawObject(data.fieldObject);
    drawObject(data.linesObject);

}

var drawObject = function( obj ) {

    // Use the combined shader program object
    gl.useProgram( glObjects.shaderProgram );
    //Enable the attribute
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation);
    // Bind buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.bufferId );
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(glObjects.aVertexPositionLocation, obj.floatsPerVertex, gl.FLOAT, false, 0 , 0 );
    // ssigns three dimensional floating point vector array values to a uniform variable 
    // for the current program object.
    gl.uniform3fv( glObjects.uMoveLocation, obj.position );
    gl.uniform3fv( glObjects.uColorRGBLocation, obj.colorRGB );
    // (mode, first, count)
    gl.drawArrays(obj.drawMode, 0 , obj.NumberOfVertices);
}


var animate = function( time ) {
    var timeDelta= time - data.animation.lastTime;
    data.animation.lastTime= time ;

    var newXpos = data.ballObject.position[0] + data.ballObject.direction[0] * data.ballObject.speed * timeDelta;
    var newYpos = data.ballObject.position[1] + data.ballObject.direction[1] * data.ballObject.speed * timeDelta;

    // Racket bounce
    if((newYpos <= data.playerObject.position[1] && data.ballObject.position[1] >= data.playerObject.position[1]) 
        && (newXpos < data.playerObject.position[0] + 0.1 && newXpos > data.playerObject.position[0] - 0.1)) {
        data.ballObject.direction[1] *= -1;
        newYpos = data.ballObject.position[1] + data.ballObject.direction[1] * data.ballObject.speed * timeDelta;
    } else
    // Bounce left-right upper half
    if((newXpos < -.9 || newXpos > .9) && newYpos > -.2) {
        data.ballObject.direction[0] *= -1;
        newXpos = data.ballObject.position[0] + data.ballObject.direction[0] * data.ballObject.speed * timeDelta;
    } else
    // Bounce top
    if(newYpos > .9) {
        data.ballObject.direction[1] *= -1;
        newYpos = data.ballObject.position[1] + data.ballObject.direction[1] * data.ballObject.speed * timeDelta;
    } else
    // Ball out lower half
    if((newYpos < -.2 && (newXpos < -.9 || newXpos > .9)) || newYpos < -.9) {
        animationStop;
        return;
    }

    data.ballObject.position[0] = newXpos;
    data.ballObject.position[1] = newYpos;

    redraw();
    gl.finish();
    data.animation.requestId = window.requestAnimationFrame(animate);
}

var animationStart = function(){
    data.animation.lastTime = window.performance.now();
    data.ballObject.direction = [((data.animation.lastTime * 100) % 11 )/ 10, ((data.animation.lastTime * 1000) % 11 )/ 10];
    data.animation.requestId = window.requestAnimationFrame(animate);
}

var animationStop = function(){
    if (data.animation.requestId)
	window.cancelAnimationFrame(data.animation.requestId);
    data.animation.requestId = 0;
    redraw();
}


var callbackOnKeyDown = function (e){
    var code= e.which || e.keyCode;
    switch(code)
    {
        case 38: // UP
            data.playerObject.direction=[0,1];
            if(data.playerObject.position[1] < -.3)
                data.playerObject.position[1] += (data.playerObject.direction[1] * 0.1);
            if(data.animation.requestId == 0) 
                animationStart();
            break;
        case 40: // DOWN
            data.playerObject.direction=[0,-1];
            if(data.playerObject.position[1] > -.9)
                data.playerObject.position[1] += (data.playerObject.direction[1] * 0.1);
            if(data.animation.requestId == 0) 
                animationStart();
            break;
        case 37: // LEFT
            data.playerObject.direction=[-1,0];
            if(data.playerObject.position[0] > -.8)
                data.playerObject.position[0] += (data.playerObject.direction[0] * 0.1);
            if(data.animation.requestId == 0) 
                animationStart();
            break;
        case 39:// RIGHT
            data.playerObject.direction=[1,0];
            if(data.playerObject.position[0] < .8)
                data.playerObject.position[0] += (data.playerObject.direction[0] * 0.1);
            if(data.animation.requestId == 0) 
                animationStart();
            break;
        case 32: // SPACE
            if(data.animation.requestId == 0) 
                animationStart();
            break;
    }
}

window.onload = function(){
    glInit(document.getElementById('canvas'));
    dataInit();
    redraw(); 
    window.onkeydown = callbackOnKeyDown;
};