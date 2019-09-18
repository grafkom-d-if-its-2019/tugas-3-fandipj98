(function() {

  var canvas, gl, program;
  var vertices1 = new Float32Array([
      -0.65, +0.5,
      -0.25, +0.5,
      -0.25, +0.4,
      -0.55, +0.4,
      -0.55, +0.3,
      -0.25, +0.3,
      -0.25, +0.2,
      -0.55, +0.2,
      -0.55, -0.2,
      -0.65,-0.2
  ]);
  var vertices2 = new Float32Array([
      +0.65, +0.5,
      +0.65, +0.4,
      +0.25, +0.5,
      +0.35, +0.4,
      +0.25, +0.4,
      +0.35, +0.3,
      +0.25, +0.3,
      +0.65, +0.3,
      +0.65, +0.2,
      +0.35, +0.2,
      +0.35, +0.3,
      +0.25, +0.3,
      +0.35, -0.2,
      +0.25,-0.2 
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

  function draw(){
      // Specify the color for clearing <canvas>
      gl.clearColor(100/255, 0/255, 0/255, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Write the positions of vertices to a vertex shader
      var n1 = initBuffers(gl,vertices1);
      
      if(n1 < 0){
          console.log('Failed to set the positions of the vertices1');
          return;
      }

      // Draw multiple points
      gl.drawArrays(gl.LINE_LOOP, 0, n1);
              
      var n2 = initBuffers(gl,vertices2);
      
      if(n2 < 0){
          console.log('Failed to set the positions of the vertices2');
          return;
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, n2);
      
  }

  function initBuffers(gl,vertices) {
      // The number of vertices
      var n = vertices.length/2;
      console.log(n);
  
      // Create a buffer object
      var vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
  
      // Bind the buffer object to target
      // target: ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      // Write date into the buffer object
      // target, size
      // usage: STATIC_DRAW, STREAM_DRAW, DYNAMIC_DRAW
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
      var aPosition = gl.getAttribLocation(program, 'aPosition');
      if (aPosition < 0) {
        console.log('Failed to get the storage location of aPosition');
        return -1;
      }
  
      // Assign the buffer object to aPosition variable
      // https://www.khronos.org/opengles/sdk/docs/man/xhtml/glVertexAttribPointer.xml
      // index, size, type, normalized, stride, pointer
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      // gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  
      // Enable the assignment to aPosition variable      
      gl.enableVertexAttribArray(aPosition);
  
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

      // redraw!
      draw();
  }

  // Register window and document callbacks
  // Resize the canvas to fill browser window dynamically
  window.addEventListener('resize',resizer);

})();