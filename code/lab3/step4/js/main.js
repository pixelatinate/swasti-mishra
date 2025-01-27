// Ideally, we like to avoid global vars, a GL context lives as long as the window does
// So this is a case where it is understandable to have it in global space.
var gl = null;
// The rest is here simply because it made debugging easier...
var myShader = null;
var myDrawable = null;
var myDrawableInitialized = null;
var modelViewMatrix = null;
var projectionMatrix = null;
var globalTime = 0.0;
var parsedData = null;
var scaling = null;
var globalTexture = null ;
var viewMatrix = null ;
var modelMatrix = null;
var sphereDrawable = null ;
var cameraPos = null ;


var Ka = 0.3; 
var Kd = 1.0;
var Ks = 1.0;
var shininessVal = 51.2 ;
var ambientColor = [0.19225, 0.19225, 0.19225];
var diffuseColor = [0.50754, 0.50754, 0.50754];
var specularColor = [0.508273, 0.508273, 0.508273];
var minAndMax = [0,0] ;

function main() {
  const canvas = document.getElementById('glCanvas');
  // Initialize the GL context
  gl = canvas.getContext('webgl2');

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert('Unable to initialize WebGL2. Contact the TA.');
    return;
  }

  // Set clear color to whatever color this is and fully opaque
  gl.clearColor(0.7, 0.7, 0.9, 1.0);
  // Clear the depth buffer
  gl.clearDepth(1.0);
  // Enable the depth function to draw nearer things over farther things
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.DEPTH_TEST);

  // Draw the scene repeatedly
  let then = 0.0;
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // The Projection matrix rarely needs updated.
  // Uncommonly, it is only modified in wacky sequences ("drunk" camera effect in GTAV)
  // or an artificial "zoom" using FOV (ARMA3)
  // Typically it is only updated when the viewport changes aspect ratio.
  // So, set it up here once since we won't let the viewport/canvas resize.
  const FOV = degreesToRadians(60);
  const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar  = 100.0;
  projectionMatrix = glMatrix.mat4.create();
  glMatrix.mat4.perspective(projectionMatrix,
                   FOV,
                   aspectRatio,
                   zNear,
                   zFar);

  // Setup Controls
  setupUI();

  // Right now, in draw, the scene will not render until the drawable is prepared
  // this allows us to acynchronously load content. If you are not familiar with async
  // that is a-okay! This link below should explain more on that topic:
  // https://blog.bitsrc.io/understanding-asynchronous-javascript-the-event-loop-74cd408419ff
  setupScene();
}

function setupUI() {
  // in index.html we need to setup some callback functions for the sliders
  // right now just have them report the values beside the slider.
  let sliders = ['cam', 'look'];
  let dims = ['X', 'Y', 'Z'];
  // for cam and look UI..
  sliders.forEach(controlType => {
    // for x, y, z control slider...
    dims.forEach(dimension => {
      let slideID = `${controlType}${dimension}`;
      console.log(`Setting up control for ${slideID}`);
      let slider = document.getElementById(slideID);
      let sliderVal = document.getElementById(`${slideID}Val`);
      // These are called "callback functions", essentially when the input
      // value for the slider or the field beside the slider change,
      // run the code we supply here!
      slider.oninput = () => {
        let newVal = slider.value;
        sliderVal.value = newVal;
      };
      sliderVal.oninput = () => {
        let newVal = sliderVal.value;
        slider.value = newVal;
      };
    });
  });
}

// Async as it loads resources over the network.
async function setupScene() {
  let objData = await loadNetworkResourceAsText('../../shared/resources/models/cube_with_vt.obj');
  let vertSource = await loadNetworkResourceAsText('../../shared/resources/shaders/verts/lab3_4_1.vert');
  let fragSource = await loadNetworkResourceAsText('../../shared/resources/shaders/frags/lab3_4_1.frag');

  let objData2 = await loadNetworkResourceAsText('../../shared/resources/models/sphere_with_vt.obj');
  let vertSource2 = await loadNetworkResourceAsText('../../shared/resources/shaders/verts/lab3_4_2.vert');
  let fragSource2 = await loadNetworkResourceAsText('../../shared/resources/shaders/frags/lab3_4_2.frag');
  
  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
  
  // Asynchronously load an image
  

  let texturePaths = [
    {direction: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url:"../../shared/resources/enviromaps/neyland_cubemap/plate1.bmp"},
    {direction: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url:"../../shared/resources/enviromaps/neyland_cubemap/plate6.bmp"},
    {direction: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url:"../../shared/resources/enviromaps/neyland_cubemap/plate5.bmp"},
    {direction: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url:"../../shared/resources/enviromaps/neyland_cubemap/plate3.bmp"},
    {direction: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url:"../../shared/resources/enviromaps/neyland_cubemap/plate2.bmp"},
    {direction: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url:"../../shared/resources/enviromaps/neyland_cubemap/plate4.bmp"},
  ]
  globalTexture = gl.createTexture() ;
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, globalTexture) ;
  for( img of texturePaths ){
    gl.texImage2D(img.direction, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, null) ;
    const image = new Image() ; 
    image.src = img.url ;

    let direc = img.direction ; 
    image.addEventListener('load', function(){
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, globalTexture) ;
      gl.texImage2D(direc, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image) ;
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP) ;
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP) ;
    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR) ;
  }

  initializeMyObject(vertSource, fragSource, objData);
  initializeMySphere(vertSource2, fragSource2, objData2);

}

function drawScene(deltaTime) {
  if (!myDrawableInitialized){
    return;
  }
  globalTime += deltaTime;

  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  modelMatrix = glMatrix.mat4.create();
  let objectWorldPos = [0.0, 0.0, 0.0];
  let rotationAxis = [0.0, 1.0, 0.0];
  glMatrix.mat4.rotate(modelMatrix, modelMatrix, globalTime, rotationAxis);

  viewMatrix  = glMatrix.mat4.create();
  cameraPos   = [document.getElementById(`camXVal`).value, document.getElementById(`camYVal`).value, document.getElementById(`camZVal`).value];
  let cameraFocus = [document.getElementById(`lookXVal`).value, document.getElementById(`lookYVal`).value, document.getElementById(`lookZVal`).value];
  glMatrix.mat4.lookAt(viewMatrix, cameraPos, cameraFocus, [0.0, 1.0, 0.0]);
  glMatrix.mat4.scale(modelMatrix,modelMatrix,scaling)
  
  modelViewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.mul(modelViewMatrix, viewMatrix, modelMatrix);

  if (myDrawableInitialized){
    myDrawable.draw();
    sphereDrawable.draw();
  }

}

function initializeMyObject(vertSource, fragSource, objData) {
  myShader = new ShaderProgram(vertSource, fragSource);
  parsedData = new OBJData(objData);
  let rawData = parsedData.getFlattenedDataFromModelAtIndex(0);
  scaling = rawData.scalingVector;

  let vertexPositionBuffer = new VertexArrayData(
    rawData.vertices,
    gl.FLOAT,
    3
  );
  
  let vertexNormalBuffer = new VertexArrayData(
    rawData.normals,
    gl.FLOAT,
    3
  );

  let vertexTexCoordBuffer = new VertexArrayData (
    rawData.uvs,
    gl.FLOAT,
    2
  );

  /*
  For any model that is smooth (non discrete) indices should be used, but we are learning! Maybe you can get this working later?
  One indicator if a model is discrete: a vertex position has two normals.
  A cube is discrete if only 8 vertices are used, but each vertex has 3 normals (each vertex is on the corner of three faces!)
  The sphere and bunny obj models are smooth though */
  // getFlattenedDataFromModelAtIndex does not return indices, but getIndexableDataFromModelAtIndex would
  //let vertexIndexBuffer = new ElementArrayData(rawData.indices);

  // In order to let our shader be aware of the vertex data, we need to bind
  // these buffers to the attribute location inside of the vertex shader.
  // The attributes in the shader must have the name specified in the following object
  // or the draw call will fail, possibly silently!
  // Checkout the vertex shaders in resources/shaders/verts/* to see how the shader uses attributes.
  // Checkout the Drawable constructor and draw function to see how it tells the GPU to bind these buffers for drawing.
  let bufferMap = {
    'aVertexPosition': vertexPositionBuffer,
    //'aBarycentricCoord': vertexBarycentricBuffer,
    //'aVertexNormal': vertexNormalBuffer,
    //'aTexturePosition': vertexTexCoordBuffer
  };

  minAndMax =[rawData.boundingBox.minY,rawData.boundingBox.maxY];

  myDrawable = new Drawable(myShader, bufferMap, null, rawData.vertices.length / 3);

  // Checkout the drawable class' draw function. It calls a uniform setup function every time it is drawn. 
  // Put your uniforms that change per frame in this setup function.
  myDrawable.uniformLocations = myShader.getUniformLocations(['uViewMatrix','uProjectionMatrix', 'Ka', 'Kd', 'Ks', 'shininessVal', 'ambientColor', 'diffuseColor', 'specularColor', 'minAndMax' ]);
  myDrawable.uniformSetup = () => {
    gl.uniformMatrix4fv(
      myDrawable.uniformLocations.uProjectionMatrix,
      false,
      projectionMatrix
    );
    
    gl.uniformMatrix4fv(
      myDrawable.uniformLocations.uViewMatrix,
      false,
      viewMatrix
    );
    gl.uniform1f(
      myDrawable.uniformLocations.Ka,
      Ka
    );
    gl.uniform1f(
      myDrawable.uniformLocations.Kd,
      Kd
    );
    gl.uniform1f(
      myDrawable.uniformLocations.Ks,
      Ks
    );
    gl.uniform1f(
      myDrawable.uniformLocations.shininessVal,
      shininessVal
    );
    gl.uniform3fv(
      myDrawable.uniformLocations.ambientColor,
      ambientColor
    );
    gl.uniform3fv(
      myDrawable.uniformLocations.diffuseColor,
      diffuseColor
    );
    gl.uniform3fv(
      myDrawable.uniformLocations.specularColor,
      specularColor
    );
    gl.uniform2fv(
      myDrawable.uniformLocations.minAndMax,
      minAndMax
    );
  };

}
  function initializeMySphere(vertSource, fragSource, objData) {
    myShader = new ShaderProgram(vertSource, fragSource);
    parsedData = new OBJData(objData);
    let rawData = parsedData.getFlattenedDataFromModelAtIndex(0);
    scaling=rawData.scalingVector;
  
    let vertexPositionBuffer = new VertexArrayData(
      rawData.vertices,
      gl.FLOAT,
      3
    );
    
    let vertexNormalBuffer = new VertexArrayData(
      rawData.normals,
      gl.FLOAT,
      3
    );
  
    let vertexTexCoordBuffer = new VertexArrayData (
      rawData.uvs,
      gl.FLOAT,
      2
    );


  /*
  let vertexBarycentricBuffer = new VertexArrayData (
    rawData.barycentricCoords,
    gl.FLOAT,
    3
  );
  */

  /*
  For any model that is smooth (non discrete) indices should be used, but we are learning! Maybe you can get this working later?
  One indicator if a model is discrete: a vertex position has two normals.
  A cube is discrete if only 8 vertices are used, but each vertex has 3 normals (each vertex is on the corner of three faces!)
  The sphere and bunny obj models are smooth though */
  // getFlattenedDataFromModelAtIndex does not return indices, but getIndexableDataFromModelAtIndex would
  //let vertexIndexBuffer = new ElementArrayData(rawData.indices);

  // In order to let our shader be aware of the vertex data, we need to bind
  // these buffers to the attribute location inside of the vertex shader.
  // The attributes in the shader must have the name specified in the following object
  // or the draw call will fail, possibly silently!
  // Checkout the vertex shaders in resources/shaders/verts/* to see how the shader uses attributes.
  // Checkout the Drawable constructor and draw function to see how it tells the GPU to bind these buffers for drawing.
  let bufferMap = {
    'aVertexPosition': vertexPositionBuffer,
    //'aBarycentricCoord': vertexBarycentricBuffer,
    'aVertexNormal': vertexNormalBuffer,
    //'aTexturePosition': vertexTexCoordBuffer
  };

  minAndMax =[rawData.boundingBox.minY,rawData.boundingBox.maxY];

  sphereDrawable = new Drawable(myShader, bufferMap, null, rawData.vertices.length / 3);

  // Checkout the drawable class' draw function. It calls a uniform setup function every time it is drawn. 
  // Put your uniforms that change per frame in this setup function.
  sphereDrawable.uniformLocations = myShader.getUniformLocations(['uViewMatrix', 'uCameraPos', 'uModelMatrix','uProjectionMatrix', 'Ka', 'Kd', 'Ks', 'shininessVal', 'ambientColor', 'diffuseColor', 'specularColor', 'minAndMax' ]);
  sphereDrawable.uniformSetup = () => {
    gl.uniformMatrix4fv(
      sphereDrawable.uniformLocations.uProjectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniform3fv(
      sphereDrawable.uniformLocations.uCameraPos,
      cameraPos 
    );
    gl.uniformMatrix4fv(
      sphereDrawable.uniformLocations.uModelMatrix,
      false,
      modelMatrix
    );
    gl.uniformMatrix4fv(
      sphereDrawable.uniformLocations.uViewMatrix,
      false,
      viewMatrix
    );
    gl.uniform1f(
      sphereDrawable.uniformLocations.Ka,
      Ka
    );
    gl.uniform1f(
      sphereDrawable.uniformLocations.Kd,
      Kd
    );
    gl.uniform1f(
      sphereDrawable.uniformLocations.Ks,
      Ks
    );
    gl.uniform1f(
      sphereDrawable.uniformLocations.shininessVal,
      shininessVal
    );
    gl.uniform3fv(
      sphereDrawable.uniformLocations.ambientColor,
      ambientColor
    );
    gl.uniform3fv(
      sphereDrawable.uniformLocations.diffuseColor,
      diffuseColor
    );
    gl.uniform3fv(
      sphereDrawable.uniformLocations.specularColor,
      specularColor
    );
    gl.uniform2fv(
      sphereDrawable.uniformLocations.minAndMax,
      minAndMax
    );
  };
  myDrawableInitialized=true;
}

// After all the DOM has loaded, we can run the main function.
window.onload = main;
