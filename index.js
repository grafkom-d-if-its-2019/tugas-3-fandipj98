(function() {

  var canvas, gl, program;
  var scaleXUniformLocation, scaleX, scaleYUniformLocation, scaleY, melebar;
  var thetaUniformLocation, theta, thetaSpeed, mmLoc, mm, vmLoc, vm, pmLoc, pm, camera, axis, x, y, z
  var flag, flagUniformLocation;

  var vertices1 = [];
  var cubePoints = [
    [ -0.5, -0.5,  0.5 ],
    [ -0.5,  0.5,  0.5 ],
    [  0.5,  0.5,  0.5 ],
    [  0.5, -0.5,  0.5 ],
    [ -0.5, -0.5, -0.5 ],
    [ -0.5,  0.5, -0.5 ],
    [  0.5,  0.5, -0.5 ],
    [  0.5, -0.5, -0.5 ]
  ];
  var cubeColors = [
    [],
    [1.0, 0.0, 0.0], // merah
    [0.0, 1.0, 0.0], // hijau
    [0.0, 0.0, 1.0], // biru
    [1.0, 1.0, 1.0], // putih
    [1.0, 0.5, 0.0], // oranye
    [1.0, 1.0, 0.0], // kuning
    []
  ];
  function quad(a, b, c, d) {
    var indices = [a, b, c, a, c, d];
    for (var i=0; i < indices.length; i++) {
      for (var j=0; j < 3; j++) {
        vertices1.push(cubePoints[indices[i]][j]);
      }
      for (var j=0; j < 3; j++) {
        vertices1.push(cubeColors[a][j]);
      }
    }
  }
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
  quad(6, 5, 1, 2);

  var vertices2 = new Float32Array([
    //x,y,z           //r,g,b
    0.4, 0.3, 0.0,   0.0, 0.0, 1.0,
    0.4, 0.2, 0.0,   0.0, 1.0, 0.0,
    0.0, 0.3, 0.0,   0.0, 1.0, 1.0,
    0.1, 0.2, 0.0,   1.0, 0.0, 0.0,
    0.0, 0.2, 0.0,   1.0, 0.0, 1.0,
    0.1, 0.1, 0.0,   1.0, 1.0, 0.0,
    0.0, 0.1, 0.0,   1.0, 1.0, 1.0,
    0.4, 0.1, 0.0,   0.0, 1.0, 1.0,
    0.4, 0.0, 0.0,   0.0, 1.0, 0.0,
    0.1, 0.0, 0.0,   1.0, 1.0, 0.0,
    0.1, 0.1, 0.0,   1.0, 1.0, 0.0,
    0.0, 0.1, 0.0,   1.0, 1.0, 1.0,
    0.1, -0.4, 0.0,   1.0, 0.0, 1.0,
    0.0, -0.4, 0.0,   1.0, 1.0, 0.0
  ]);

  glUtils.SL.init({ callback: function() { main(); }});
  
  function main() {
    // Register Callbacks
    window.addEventListener('resize', resizer);

    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    initGlSize();

    //initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
    
    resizer();
    draw();
  
  }

  function initGlSize() {
    var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
    // Fullscreen if not set
    if (width) {
      gl.maxWidth = width;
    }
    if (height) {
      gl.maxHeight = height;
    }
  }

  function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    theta += thetaSpeed;
    if (axis[z]) glMatrix.mat4.rotateZ(mm, mm, thetaSpeed);
    if (axis[y]) glMatrix.mat4.rotateY(mm, mm, thetaSpeed);
    if (axis[x]) glMatrix.mat4.rotateX(mm, mm, thetaSpeed);
    gl.uniformMatrix4fv(mmLoc, false, mm);

    glMatrix.mat4.lookAt(vm,
      [camera.x, camera.y, camera.z], // di mana posisi kamera (posisi)
      [0.0, 0.0, -2.0], // ke mana kamera menghadap (vektor)
      [0.0, 1.0, 0.0]  // ke mana arah atas kamera (vektor)
    );
    gl.uniformMatrix4fv(vmLoc, false, vm);
    
    var n1 = initBuffersKubus(gl, vertices1);
    flag = 0;
    gl.uniform1i(flagUniformLocation, flag);
    gl.drawArrays(gl.TRIANGLES, 0, n1);
            
    //animasi refleksi
    if (scaleX >= 1.0) melebar = -1.0;
    else if (scaleX <= -1.0) melebar = 1.0;
    scaleX += 0.0056 * melebar;
    gl.uniform1f(scaleXUniformLocation, scaleX);

    var n2 = initBuffers(gl,vertices2);
    
    if(n2 < 0){
        console.log('Failed to set the positions of the vertices2');
        return;
    }

    flag = 1;
    gl.uniform1i(flagUniformLocation, flag);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n2);

    requestAnimationFrame(render);
  }

  function draw(){

    // Membuat sambungan untuk uniform
    thetaUniformLocation = gl.getUniformLocation(program, 'theta');
    theta = 0;
    thetaSpeed = 0.0;
    axis = [true, true, true];
    x = 0;
    y = 1;
    z = 2;

    // Definisi untuk matriks model
    mmLoc = gl.getUniformLocation(program, 'modelMatrix');
    mm = glMatrix.mat4.create();
    glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);

    // Definisi untuk matrix view dan projection
    vmLoc = gl.getUniformLocation(program, 'viewMatrix');
    vm = glMatrix.mat4.create();
    pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
    pm = glMatrix.mat4.create();
    camera = {x: 0.0, y: 0.0, z:0.0};
    glMatrix.mat4.perspective(pm,
      glMatrix.glMatrix.toRadian(90), // fovy dalam radian
      canvas.width/canvas.height,     // aspect ratio
      0.5,  // near
      10.0, // far  
    );
    gl.uniformMatrix4fv(pmLoc, false, pm);
    
    scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
    scaleX = 1.0;
    gl.uniform1f(scaleXUniformLocation, scaleX);

    scaleYUniformLocation = gl.getUniformLocation(program, 'scaleY');
    scaleY = 1.0;
    gl.uniform1f(scaleYUniformLocation, scaleY);

    flagUniformLocation = gl.getUniformLocation(program, 'flag');
    flag = 0;
    gl.uniform1i(flagUniformLocation, flag);

    melebar = 1.0;

    gl.clearColor(100/255, 0/255, 0/255, 1.0);
    gl.enable(gl.DEPTH_TEST);
    render();

  }

  function initBuffers(gl,vertices) {
    // The number of vertices
    var n = vertices.length/6;
   
    // Create a buffer object
    var vertexBufferObject = gl.createBuffer();
    if (!vertexBufferObject) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // Bind the buffer object to target
    // target: ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    // Write date into the buffer object
    // usage: STATIC_DRAW, STREAM_DRAW, DYNAMIC_DRAW
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, 'vPosition');
    if (vPosition < 0) {
      console.log('Failed to get the storage location of vPosition');
      return -1;
    }
    
    var vColor = gl.getAttribLocation(program, 'vColor');
    if (vColor < 0) {
      console.log('Failed to get the storage location of vColor');
      return -1;
    }

    // Assign the buffer object to vPosition variable
    gl.vertexAttribPointer(
      vPosition,   //variable yang memegang posisis attribute di shader
      3,          // jumlah elemen per atribut vPosition
      gl.FLOAT,   // tipe data atribut
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex (overall)
      0                                    // offset dari posisi elemen di array
    );
    
    gl.vertexAttribPointer(
      vColor,
      3,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    );

    // Enable the assignment to vPosition variable      
    gl.enableVertexAttribArray(vPosition);
    // Enable the assignment to vPosition variable      
    gl.enableVertexAttribArray(vColor);
  
    return n;
  }

  function initBuffersKubus(gl,vertices) {
    // The number of vertices
    var n = vertices.length/6;
   
    // Create a buffer object
    var vertexBufferObject = gl.createBuffer();
    if (!vertexBufferObject) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // Bind the buffer object to target
    // target: ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    // Write date into the buffer object
    // usage: STATIC_DRAW, STREAM_DRAW, DYNAMIC_DRAW
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPositionKubus = gl.getAttribLocation(program, 'vPositionKubus');
    if (vPositionKubus < 0) {
      console.log('Failed to get the storage location of vPosition');
      return -1;
    }
    
    var vColor = gl.getAttribLocation(program, 'vColor');
    if (vColor < 0) {
      console.log('Failed to get the storage location of vColor');
      return -1;
    }

    gl.vertexAttribPointer(
      vPositionKubus,    // variabel yang memegang posisi attribute di shader
      3,            // jumlah elemen per atribut
      gl.FLOAT,     // tipe data atribut
      gl.FALSE, 
      6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
      0                                   // offset dari posisi elemen di array
    );
    gl.vertexAttribPointer(
      vColor,
      3,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    );

    // Enable the assignment to vPosition variable      
    gl.enableVertexAttribArray(vPositionKubus);
    // Enable the assignment to vColor variable      
    gl.enableVertexAttribArray(vColor);
  
    return n;
  }

  function onKeyDown(event) {
    if (event.keyCode == 189) thetaSpeed -= 0.01;       // key '-' google chrome
    else if (event.keyCode == 187) thetaSpeed += 0.01;  // key '='
    // if (event.keyCode == 173) thetaSpeed -= 0.01;       // key '-' firefox mozilla
    // else if (event.keyCode == 61) thetaSpeed += 0.01;  // key '='
    else if (event.keyCode == 48) thetaSpeed = 0;       // key '0'
    if (event.keyCode == 88) axis[x] = !axis[x];
    if (event.keyCode == 89) axis[y] = !axis[y];
    if (event.keyCode == 90) axis[z] = !axis[z];
    if (event.keyCode == 38) camera.z -= 0.1;
    else if (event.keyCode == 40) camera.z += 0.1;
    if (event.keyCode == 37) camera.x -= 0.1;
    else if (event.keyCode == 39) camera.x += 0.1;
  }
  document.addEventListener('keydown', onKeyDown);
  
  //fungsi untuk meresize ukuran canvas agar square
  function resizer(){
    /**
    * Callback for when the screen is resized
    **/

    // Scaling for a square!
    var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
    // Fullscreen if not set
    if (!width || width < 0) {
        canvas.width = window.innerWidth;
        gl.maxWidth = window.innerWidth;
    }
    if (!height || height < 0) {
        canvas.height = window.innerHeight;
        gl.maxHeight = window.innerHeight;
    }

    // scale down for smaller size
    var min = Math.min.apply(Math, [gl.maxWidth, gl.maxHeight, window.innerWidth, window.innerHeight]);
    canvas.width = min;
    canvas.height = min;

    // viewport!
    gl.viewport(0, 0, canvas.width, canvas.height);
    
  }

  // Register window and document callbacks
  // Resize the canvas to fill browser window dynamically
  window.addEventListener('resize',resizer);

})();