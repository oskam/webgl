var canvas = document.getElementById("can");
var context = canvas.getContext("2d");
context.strokeStyle = "rgb(255,255,255)";
var display = {
    width: canvas.width,
    height: canvas.height
};
var cuboids = new Array();

// line segment
function Line(x1, y1, z1, x2, y2, z2) {
    this.start = { x:x1, y:y1, z:z1 };
    this.end = { x:x2, y:y2, z:z2 };
}

// adding random cuboids to array
function createCuboid(){
    var x = Math.floor((Math.random()- 0.5) * 100);
    var y = Math.floor((Math.random()- 0.5) * 100);
    var z = Math.floor((Math.random()- 0.5) * 100);
    var lx = Math.floor((Math.random() * 20) + 1);
    var ly = Math.floor((Math.random() * 20) + 1);
    var lz = Math.floor((Math.random() * 20) + 1);


    this.cuboids.push(new Line(x, y, z, x+lx, y, z)); //1
    this.cuboids.push(new Line(x, y, z, x, y+ly, z)); //2
    this.cuboids.push(new Line(x, y, z, x, y, z+lz)); //3
    this.cuboids.push(new Line(x+lx, y, z+lz, x, y, z+lz)); //4
    this.cuboids.push(new Line(x+lx, y, z+lz, x+lx, y+ly, z+lz)); //5
    this.cuboids.push(new Line(x+lx, y, z+lz, x+lx, y, z)); //6
    this.cuboids.push(new Line(x, y+ly, z+lz, x+lx, y+ly, z+lz)); //7
    this.cuboids.push(new Line(x, y+ly, z+lz, x, y, z+lz)); //8
    this.cuboids.push(new Line(x, y+ly, z+lz, x, y+ly, z)); //9
    this.cuboids.push(new Line(x+lx, y+ly, z, x, y+ly, z)); //10
    this.cuboids.push(new Line(x+lx, y+ly, z, x+lx, y, z)); //11
    this.cuboids.push(new Line(x+lx, y+ly, z, x+lx, y+ly, z+lz)); //12
}

// rendering 3D cuboids on canvas
function renderCuboids() {
    // canvas reset
    context.clearRect(0, 0, canvas.width, canvas.height);
    
	for (i=0; i<cuboids.length; i++){
        render(cuboids[i], camera);
	}
}

// rendering line on canvas
function render(line) {

    // the position of point A with respect to a coordinate system defined by the camera
    var dStart= camera.relativePosition(line.start.x, line.start.y, line.start.z);
    var dEnd = camera.relativePosition(line.end.x, line.end.y, line.end.z);

    // coordinates of canvas for point dStart and dEnd
    var cooStart = camera.newProjection(dStart.x, dStart.y, dStart.z);
    var cooEnd = camera.newProjection(dEnd.x, dEnd.y, dEnd.z);

    // NarotateYsuj
    context.beginPath();
    context.moveTo(cooStart.x, cooStart.y);
    context.lineTo(cooEnd.x, cooEnd.y);
    context.stroke();
}

// Camera (observer)
var camera = {
    // camera coordinates
    cameraX: 95.0, cameraY: 50.0, cameraZ: -95.0,
    // camera rotating in radians
    rotateX: Math.PI/8, rotateY: -Math.PI/4, rotateZ: 0.0,
    // flied of view
    fov: Math.PI / 2,
    // changing position of camera
    changePosition: function(x, y, z) {
        this.cameraX += x;
        this.cameraY += y;
        this.cameraZ += z;
        renderCuboids();
    },
    // camera rotation setup
    changeRotation: function(x, y, z) {
        this.rotateX += x;
        this.rotateY += y;
        this.rotateZ += z;
        renderCuboids();
    },
    // static setup for camer 
    setRotation: function(x, y, z) {
        this.rotateX = x;
        this.rotateY = y;
        this.rotateZ = z;
        renderCuboids();
    },

    // function sets coordinates for the point in relative to camera and it's rotation
    relativePosition: function(pX, pY, pZ) {

        x = pX - this.cameraX;
        y = pY - this.cameraY;
        z = pZ - this.cameraZ;

        sX = Math.sin(this.rotateX);
        sY = Math.sin(this.rotateY);
        sZ = Math.sin(this.rotateZ);

        cX = Math.cos(this.rotateX);
        cY = Math.cos(this.rotateY);
        cZ = Math.cos(this.rotateZ);

        // d vector
        dX = cY * (sZ*y + cZ*x) - sY*z;
        dY = sX * (cY*z + sY * (sZ*y + cZ*x)) + cX * (cZ*y - sZ*x);
        dZ = cX * (cY*z + sY * (sZ*y + cZ*x)) - sX * (cZ*y - sZ*x);

        return {x:dX, y:dY, z:dZ};
    },

    // function sets canvas coordinates of prepared point sets in relative coordinate system (for observer)
    newProjection: function(dX, dY, dZ) {
        // aspect ratio
        ratio = display.width / display.height;
        R = this.fov / 2;
        // window sieze depends of distance point Z to 0,0,0
        sizeFactor = dZ;

        // max Y on screen
        windowSizeY = sizeFactor * Math.tan(R);
        // max X on screen
        windowSizeX = windowSizeY * ratio;
        // changing coordinates from 3d to 2d
        bX = dX + windowSizeX / 2;
        bY = dY + windowSizeY / 2;
        // canvas coordinates
        canvasX = bX * display.width / windowSizeX;
        canvasY = display.height - bY * display.height / windowSizeY;

        return {x:canvasX, y:canvasY};
    }
};

// button support
function leftX(){
    camera.changePosition(-2,0,0)
}
function rightX(){
    camera.changePosition(2,0,0)
}
function upX(){
    camera.changeRotation(-1/16,0,0)
}
function downX(){
    camera.changeRotation(1/16,0,0)
}

function leftY(){
    camera.changeRotation(0,-1/16,0)
}
function rightY(){
    camera.changeRotation(0,1/16,0)
}
function upY(){
    camera.changePosition(0,2,0)
}
function downY(){
    camera.changePosition(0,-2,0)
}

function leftZ(){
    camera.changeRotation(0,0,-1/16)
}
function rightZ(){
    camera.changeRotation(0,0,1/16)
}
function upZ(){
    camera.changePosition(0,0,2)
}
function downZ(){
    camera.changePosition(0,0,-2)
}

// left mouse button support (rotating)
var modCam = false;
var startX = 0;
var startY = 0;
var startRotationX = 0;
var startRotationY = 0;
var maxRotationX = Math.PI / display.width;
var maxRotationY = Math.PI / display.height;

// mouse moving
canvas.addEventListener("mousemove", moveCamera, false);
function moveCamera(e) {
    if(modCam) {
        x = e.offsetX - startX;
        y = e.offsetY - startY;
        rotX = x * maxRotationX + startRotationX;
        rotY = y * maxRotationY + startRotationY;
        camera.setRotation(rotY,rotX,camera.rotateZ);
    }
}

// holding mouse button
canvas.addEventListener("mousedown", checkButton, false);
function checkButton(e) {
    modCam = e.which == 1;
    if(modCam) {
        startRotationX = camera.rotateY;
        startRotationY = camera.rotateX;
        startX = e.offsetX;
        startY = e.offsetY;
    }
}

// releasing the button
canvas.addEventListener("mouseup", downButton, false);
function downButton(e) {
    modCam = false;
}

// script start
window.onload = function() {
    document.getElementById("left_x").onclick = leftX,
    document.getElementById("right_x").onclick = rightX,
    document.getElementById("up_x").onclick = upX,
    document.getElementById("down_x").onclick = downX,

    document.getElementById("left_y").onclick = leftY,
    document.getElementById("right_y").onclick = rightY,
    document.getElementById("up_y").onclick = upY,
    document.getElementById("down_y").onclick = downY;

    document.getElementById("left_z").onclick = leftZ,
    document.getElementById("right_z").onclick = rightZ,
    document.getElementById("up_z").onclick = upZ,
    document.getElementById("down_z").onclick = downZ;



    for(var i=0; i < 40; i++){
        createCuboid();
    };
    renderCuboids();
}