(function() {

  var canvas, gl, program;
  var thetaUniformLocation, scaleXUniformLocation, scaleX, scaleYUniformLocation, scaleY, theta, melebar;
  var flag, flagUniformLocation;
  var vertices1 = new Float32Array([
      //x,y           //r,g,b
      -0.1, 0.3,    0.0, 0.0, 1.0,
      0.3, 0.3,    0.0, 1.0, 0.0,
      0.3, 0.2,    0.0, 1.0, 1.0,
      0.0, 0.2,    1.0, 0.0, 0.0,
      0.0, 0.1,    1.0, 0.0, 1.0,
      0.3, 0.1,    1.0, 1.0, 0.0,
      0.3, 0.0,    1.0, 1.0, 1.0,
      0.0, 0.0,    0.0, 0.0, 0.0,
      0.0, -0.4,    0.0, 0.0, 1.0,
      -0.1, -0.4,    0.0, 1.0, 0.0
  ]);
  var vertices2 = new Float32Array([
      //x,y           //r,g,b
      0.4, 0.3,    0.0, 0.0, 1.0,
      0.4, 0.2,    0.0, 1.0, 0.0,
      0.0, 0.3,    0.0, 1.0, 1.0,
      0.1, 0.2,    1.0, 0.0, 0.0,
      0.0, 0.2,    1.0, 0.0, 1.0,
      0.1, 0.1,    1.0, 1.0, 0.0,
      0.0, 0.1,    1.0, 1.0, 1.0,
      0.4, 0.1,    0.0, 1.0, 1.0,
      0.4, 0.0,    0.0, 1.0, 0.0,
      0.1, 0.0,    1.0, 1.0, 0.0,
      0.1, 0.1,    1.0, 1.0, 0.0,
      0.0, 0.1,    1.0, 1.0, 1.0,
      0.1, -0.4,    1.0, 0.0, 1.0,
      0.0, -0.4,    1.0, 1.0, 0.0
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
    //animasi rotate
    theta += 0.0056;
    gl.uniform1f(thetaUniformLocation, theta);
    
    //animasi refleksi
    if (scaleX >= 1.0) melebar = -1.0;
    else if (scaleX <= -1.0) melebar = 1.0;
    scaleX += 0.0056 * melebar;
    gl.uniform1f(scaleXUniformLocation, scaleX);

    gl.clearColor(100/255, 0/255, 0/255, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Write the positions of vertices to a vertex shader
    var n1 = initBuffers(gl,vertices1);
    
    if(n1 < 0){
        console.log('Failed to set the positions of the vertices1');
        return;
    }

    flag = 0;
    gl.uniform1i(flagUniformLocation, flag);

    // Draw multiple points
    gl.drawArrays(gl.LINE_LOOP, 0, n1);
            
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
    //membuat sambungan untuk theta
    thetaUniformLocation = gl.getUniformLocation(program, 'theta');
    //var theta = Math.PI; // 180 derajat dalam radian

    scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
    scaleX = 1.0;
    gl.uniform1f(scaleXUniformLocation, scaleX);

    scaleYUniformLocation = gl.getUniformLocation(program, 'scaleY');
    scaleY = 1.0;
    gl.uniform1f(scaleYUniformLocation, scaleY);

    flagUniformLocation = gl.getUniformLocation(program, 'flag');
    flag = 0;
    gl.uniform1i(flagUniformLocation, flag);

    //Membuat animasi rotation
    theta = 0;
    gl.uniform1f(thetaUniformLocation, theta);

    melebar = 1.0;
    
    render();
    
  }

  function initBuffers(gl,vertices) {
    // The number of vertices
    var n = vertices.length/5;
   
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
      2,          // jumlah elemen per atribut vPosition
      gl.FLOAT,   // tipe data atribut
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex (overall)
      0                                    // offset dari posisi elemen di array
    );
    
    gl.vertexAttribPointer(
      vColor,
      3,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      2 * Float32Array.BYTES_PER_ELEMENT
    );

    // Enable the assignment to vPosition variable      
    gl.enableVertexAttribArray(vPosition);
    // Enable the assignment to vPosition variable      
    gl.enableVertexAttribArray(vColor);
  
    return n;
  }
  
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