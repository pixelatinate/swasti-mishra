class OBJData {
  constructor(fileContents) {
    this.fileContents = fileContents;
    this.parse(this.fileContents);
  }

  result = {
    models: [],
    materialLibraries: []
  };
  currentMaterial = '';
  currentGroup = '';
  smoothingGroup = 0;
  fileContents = null;
  

  parse() {

    const stripComment = (lineString) => {
      const commentIndex = lineString.indexOf('#');
      if (commentIndex > -1) { return lineString.substring(0, commentIndex); }
      return lineString;
    };

    const lines = this.fileContents.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const line = stripComment(lines[i]);

      const lineItems = line.replace(/\s\s+/g, ' ').trim().split(' ');
      if (line.length <= 0) continue;
      switch (lineItems[0].toLowerCase()) {
        case 'o': // Start A New Model
          this.parseObject(lineItems);
          break;
        case 'g': // Start a new polygon group
          this.parseGroup(lineItems);
          break;
        case 'v': // Define a vertex for the current model
          this.parseVertexCoords(lineItems);
          break;
        case 'vt': // Texture Coords
          this.parseTextureCoords(lineItems);
          break;
        case 'vn': // Define a vertex normal for the current model
          this.parseVertexNormal(lineItems);
          break;
        case 's': // Smooth shading statement
          this.parseSmoothShadingStatement(lineItems);
          break;
        case 'f': // Define a Face/Polygon
          this.parsePolygon(lineItems);
          break;
        case 'mtllib': // Reference to a material library file (.mtl)
          this.parseMtlLib(lineItems);
          break;
        case 'usemtl': // Sets the current material to be applied to polygons defined from this point forward
          this.parseUseMtl(lineItems);
          break;
        case '#':
          break;
        default:
          console.warn(`Unhandled obj statement at line #${i}: ${line}`);
          break;
      }
    }

    return this.result;
  }

  currentModel() {
    if (this.result.models.length == 0) {
      this.result.models.push({
        name: this.defaultModelName,
        vertices: [],
        textureCoords: [],
        vertexNormals: [],
        faces: []
      });
      this.currentGroup = '';
      this.smoothingGroup = 0;
    }

    return this.result.models[this.result.models.length - 1];
  }

  getModelAtIndex(index) {
    return this.result.models[index];
  }

  /**
   * getIndexableDataFromModelAtIndex - generates indexable raw geometry data for the model at specified index
   * @param {Number} index the index of the model you are interested in (multiple models may exist in one obj file) 
   */
  getIndexableDataFromModelAtIndex(index) {
    /*
    There is no guarantee this function works for 100% of obj models.
    This assumes for each vertex there is exactly one normal, one position, one texture coord.
    Some models do not abide by this, such as discrete models.
    */
    const model = this.result.models[index];
    const faces = model.faces;
    const vertices = model.vertices;
    const textureCoords = model.textureCoords;
    const vertexNormals = model.vertexNormals;

    let indexData = [];
    faces.forEach(face => {
      // A face can have 3+ vertices.
      // Since we want triangles, we turn the face into a fan of triangles.
      // http://docs.safe.com/fme/2017.1/html/FME_Desktop_Documentation/FME_Workbench/!FME_Geometry/IFMETriangleFan.htm
      let vertsOnFace = face.vertices;
      let initialVert = vertsOnFace[0];
      for (let i = 1; i < vertsOnFace.length - 1; ++i){
        let triangle = [initialVert, vertsOnFace[i], vertsOnFace[i + 1]];
        triangle.forEach(triangleVert => {
          indexData.push(triangleVert.vertexIndex - 1);
        });
      }
    });

    let textureData = [];
    textureCoords.forEach(coord => {
      textureData.push(coord.u);
      textureData.push(coord.v);
    });

    let normalData = [];
    vertexNormals.forEach(normal => {
      normalData.push(normal.x);
      normalData.push(normal.y);
      normalData.push(normal.z);
    });

    let vertexData = [];
    vertices.forEach(vertex => {
      vertexData.push(vertex.x);
      vertexData.push(vertex.y);
      vertexData.push(vertex.z);
    });

    return {
      indices: indexData,
      uvs: textureData,
      normals: normalData,
      vertices: vertexData
    }
  }

  /**
   * getFlattenedDataFromModelAtIndex - generates flattened geometry data, prefer the indexable method if model is not discrete
   * @param {Number} index the index of the model you are interested in (multiple models may exist in one obj file) 
   */
  getFlattenedDataFromModelAtIndex(index) {
    const model = this.result.models[index];
    const faces = model.faces;
    const vertices = model.vertices;
    const textureCoords = model.textureCoords;
    const vertexNormals = model.vertexNormals;

    let textureData = [];
    let normalData = [];
    let vertexData = [];
    let tangentData = [];
    let bitangentData = [];

    // This is just for the wireframe shader, feel free to remove this information if not necessary
    // I am only including it here for a cheap wireframe effect.
    
    let barycentricCoords = [];
    let barycentricValues = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]];
    if(textureCoords.length!=0){
      faces.forEach(face => {
        let vertsOnFace = face.vertices;
        let initialVert = vertsOnFace[0];
        
        for (let i = 1; i < vertsOnFace.length - 1; ++i){
          let triangle = [initialVert, vertsOnFace[i], vertsOnFace[i + 1]];
          
          let v0 = glMatrix.vec3.fromValues( vertices[triangle[0].vertexIndex - 1].x,
                                      vertices[triangle[0].vertexIndex - 1].y,
                                      vertices[triangle[0].vertexIndex - 1].z ) ;
          let v1 = glMatrix.vec3.fromValues( vertices[triangle[1].vertexIndex - 1].x,
                                      vertices[triangle[1].vertexIndex - 1].y,
                                      vertices[triangle[1].vertexIndex - 1].z ) ;
          let v2 = glMatrix.vec3.fromValues( vertices[triangle[2].vertexIndex - 1].x,
                                      vertices[triangle[2].vertexIndex - 1].y,
                                      vertices[triangle[2].vertexIndex - 1].z ) ;

          let uv0 = glMatrix.vec2.fromValues( textureCoords[triangle[0].textureCoordsIndex - 1].u,
                                        textureCoords[triangle[0].textureCoordsIndex - 1].v) ;
          let uv1 = glMatrix.vec2.fromValues( textureCoords[triangle[1].textureCoordsIndex - 1].u,
                                        textureCoords[triangle[1].textureCoordsIndex - 1].v) ;
          let uv2 = glMatrix.vec2.fromValues( textureCoords[triangle[2].textureCoordsIndex - 1].u,
                                        textureCoords[triangle[2].textureCoordsIndex - 1].v) ;
          
          let deltaPos1 = glMatrix.vec3.create() ;
          let deltaPos2 = glMatrix.vec3.create() ;
          glMatrix.vec3.sub(deltaPos1, v1, v0) ;
          glMatrix.vec3.sub(deltaPos2, v2, v0) ;

          let deltaUV1 = glMatrix.vec2.create() ;
          let deltaUV2 = glMatrix.vec2.create() ;
          glMatrix.vec2.sub(deltaUV1, uv1, uv0) ;
          glMatrix.vec2.sub(deltaUV2, uv2, uv0) ;

          /* 
          glm::vec3 tangent = (deltaPos1 * deltaUV2.y   - deltaPos2 * deltaUV1.y)*r;
          glm::vec3 bitangent = (deltaPos2 * deltaUV1.x   - deltaPos1 * deltaUV2.x)*r;
          */

          let r = 1.0 / (deltaUV1[0]*deltaUV2[1]-deltaUV1[1] * deltaUV2[0])
          
          let tangent = glMatrix.vec3.create() ;
          let bitangent = glMatrix.vec3.create() ;
          let temp = glMatrix.vec3.create() ;
          glMatrix.vec3.mul(tangent, deltaPos1, glMatrix.vec3.fromValues(deltaUV2[1],deltaUV2[1],deltaUV2[1]));
          glMatrix.vec3.mul(temp, deltaPos2, glMatrix.vec3.fromValues(deltaUV1[1],deltaUV1[1],deltaUV1[1]));
          glMatrix.vec3.sub(tangent, tangent, temp);
          glMatrix.vec3.mul(tangent, tangent, glMatrix.vec3.fromValues(r,r,r));
          
          glMatrix.vec3.mul(bitangent, deltaPos2, glMatrix.vec3.fromValues(deltaUV1[0],deltaUV1[0],deltaUV1[0]));
          glMatrix.vec3.mul(temp, deltaPos1, glMatrix.vec3.fromValues(deltaUV2[0],deltaUV2[0],deltaUV2[0]));
          glMatrix.vec3.sub(bitangent, bitangent, temp);
          glMatrix.vec3.mul(bitangent, bitangent, glMatrix.vec3.fromValues(r,r,r));
          
          for( let i = 0 ; i < 3 ; i++ ){
            tangentData.push(tangent[0]) ;
            tangentData.push(tangent[1]) ;
            tangentData.push(tangent[2]) ;
            bitangentData.push(bitangent[0]) ;
            bitangentData.push(bitangent[1]) ;
            bitangentData.push(bitangent[2]) ;
          }
        }
      });
    }

    // If your model does not have vertex normals, you should detect that here
    // and can calculate them here.

    // Find the difference in two of the vertexes, find the cross product of that, normalize and 
    // that's the normals of the face. Then normalize that and add it to the vertex to find the vertex normals.

    let myNormals = [] ;
    
    if( vertexNormals.length == 0 ){
      for( let i = 0 ; i < vertices.length; i++ ){
        myNormals.push( glMatrix.vec3.fromValues(0.0,0.0,0.0) )
      }

      faces.forEach(face => {
        let vertsOnFace = face.vertices;
        let initialVert = vertsOnFace[0];
        
        for (let i = 1; i < vertsOnFace.length - 1; ++i){
          let triangle = [initialVert, vertsOnFace[i], vertsOnFace[i + 1]];
          let A = glMatrix.vec3.fromValues( vertices[triangle[0].vertexIndex - 1].x, 
                                      vertices[triangle[0].vertexIndex - 1].y, 
                                      vertices[triangle[0].vertexIndex - 1].z ) ;
          let B = glMatrix.vec3.fromValues( vertices[triangle[1].vertexIndex - 1].x, 
                                      vertices[triangle[1].vertexIndex - 1].y, 
                                      vertices[triangle[1].vertexIndex - 1].z ) ;
          let C = glMatrix.vec3.fromValues( vertices[triangle[2].vertexIndex - 1].x, 
                                      vertices[triangle[2].vertexIndex - 1].y, 
                                      vertices[triangle[2].vertexIndex - 1].z ) ;
          // B-A, C-A
          // then you can add C to each of them 
          glMatrix.vec3.sub( B, B, A ) ;
          glMatrix.vec3.sub( C, C, A ) ;
          glMatrix.vec3.cross( C, C, B ) ;
          glMatrix.vec3.normalize( C, C ) ;
          glMatrix.vec3.add(myNormals[triangle[0].vertexIndex-1], myNormals[triangle[0].vertexIndex-1], C) ;
          glMatrix.vec3.add(myNormals[triangle[1].vertexIndex-1], myNormals[triangle[1].vertexIndex-1], C) ;
          glMatrix.vec3.add(myNormals[triangle[2].vertexIndex-1], myNormals[triangle[2].vertexIndex-1], C) ;
        }
      });
    }

    let bbox = {
      maxX: 0 , 
      maxY: 0 , 
      maxZ: 0 , 
      minX: 0 ,
      minY: 0 ,
      minZ: 0
    } ;
    
    faces.forEach(face => {
      // A face can have 3+ vertices.
      // Since we want triangles, we turn the face into a fan of triangles.
      // http://docs.safe.com/fme/2017.1/html/FME_Desktop_Documentation/FME_Workbench/!FME_Geometry/IFMETriangleFan.htm
      let vertsOnFace = face.vertices;
      let initialVert = vertsOnFace[0];
      for (let i = 1; i < vertsOnFace.length - 1; ++i){
        let triangle = [initialVert, vertsOnFace[i], vertsOnFace[i + 1]];
        triangle.forEach((triangleVert, index) => {
          // Obj models are not zero index, so we subtract 1 from the indicated indices
          
          vertexData.push(vertices[triangleVert.vertexIndex - 1].x);
          if ( vertices[triangleVert.vertexIndex - 1].x > bbox.maxX ){
            bbox.maxX = vertices[triangleVert.vertexIndex - 1].x ;
          }
          if( vertices[triangleVert.vertexIndex - 1].x < bbox.minX ){
            bbox.minX = vertices[triangleVert.vertexIndex - 1].x ;
          }
          vertexData.push(vertices[triangleVert.vertexIndex - 1].y);
          if ( vertices[triangleVert.vertexIndex - 1].y > bbox.maxY ){
            bbox.maxY = vertices[triangleVert.vertexIndex - 1].y ;
          }
          if( vertices[triangleVert.vertexIndex - 1].x < bbox.minY ){
            bbox.minY = vertices[triangleVert.vertexIndex - 1].y ;
          }
          vertexData.push(vertices[triangleVert.vertexIndex - 1].z);
          if ( vertices[triangleVert.vertexIndex - 1].z > bbox.maxZ ){
            bbox.maxZ = vertices[triangleVert.vertexIndex - 1].z ;
          }
          if( vertices[triangleVert.vertexIndex - 1].z < bbox.minZ ){
            bbox.minZ = vertices[triangleVert.vertexIndex - 1].z ;
          }

          if(textureCoords[triangleVert.textureCoordsIndex - 1]) {
            textureData.push(textureCoords[triangleVert.textureCoordsIndex - 1].u);
            textureData.push(textureCoords[triangleVert.textureCoordsIndex - 1].v);
          }

          if(vertexNormals[triangleVert.vertexNormalIndex - 1]) {
            normalData.push(vertexNormals[triangleVert.vertexNormalIndex - 1].x);
            normalData.push(vertexNormals[triangleVert.vertexNormalIndex - 1].y);
            normalData.push(vertexNormals[triangleVert.vertexNormalIndex - 1].z);
          }
          else{
            normalData.push(myNormals[triangleVert.vertexIndex - 1][0]);
            normalData.push(myNormals[triangleVert.vertexIndex - 1][1]);
            normalData.push(myNormals[triangleVert.vertexIndex - 1][2]);
          }

          barycentricCoords.push(barycentricValues[index][0]);
          barycentricCoords.push(barycentricValues[index][1]);
          barycentricCoords.push(barycentricValues[index][2]);
        });
      }
      
    });

    function vectorMagnitude(x, y, z){  
      var sum = x * x + y * y + z * z;
      return Math.sqrt(sum);
    }

    let span   = [bbox.maxX-bbox.minX, bbox.maxY-bbox.minY, bbox.maxZ-bbox.minZ] ;
    let unitspan = vectorMagnitude(span[0], span[1], span[2]);
    let xScale = 1 / unitspan  ;
    let yScale = 1 / unitspan  ;
    let zScale = 1 / unitspan  ;
    let scalingVector = [xScale, yScale, zScale] ;

    // if (normalData.length < 1) console.warn("No normal data loaded for model.");
    if (vertexData.length < 1) console.warn("No vertex data loaded for model.");
    if (textureData.length < 1) console.warn("No texture data loaded for model.");
    return {
      uvs: textureData,
      normals: normalData,
      vertices: vertexData,
      barycentricCoords: barycentricCoords,
      scalingVector: scalingVector,
      boundingBox:bbox,
      tangent: tangentData,
      bitangent: bitangentData
    }
  }

  parseObject(lineItems) {
    const modelName = lineItems.length >= 2 ? lineItems[1] : this.defaultModelName;
    this.result.models.push({
      name: modelName,
      vertices: [],
      textureCoords: [],
      vertexNormals: [],
      faces: []
    });
    this.currentGroup = '';
    this.smoothingGroup = 0;
  }

  parseGroup(lineItems) {
    if (lineItems.length != 2) { throw 'Group statements must have exactly 1 argument (eg. g group_1)'; }

    this.currentGroup = lineItems[1];
  }

  parseVertexCoords(lineItems) {
    const x = lineItems.length >= 2 ? parseFloat(lineItems[1]) : 0.0;
    const y = lineItems.length >= 3 ? parseFloat(lineItems[2]) : 0.0;
    const z = lineItems.length >= 4 ? parseFloat(lineItems[3]) : 0.0;

    this.currentModel().vertices.push({ x, y, z });
  }

  parseTextureCoords(lineItems) {
    const u = lineItems.length >= 2 ? parseFloat(lineItems[1]) : 0.0;
    const v = lineItems.length >= 3 ? parseFloat(lineItems[2]) : 0.0;
    const w = lineItems.length >= 4 ? parseFloat(lineItems[3]) : 0.0;

    if (lineItems.length >= 4)
      this.currentModel().textureCoords.push({ u, v, w });
    else
      this.currentModel().textureCoords.push({ u, v });
  }

  parseVertexNormal(lineItems) {
    const x = lineItems.length >= 2 ? parseFloat(lineItems[1]) : 0.0;
    const y = lineItems.length >= 3 ? parseFloat(lineItems[2]) : 0.0;
    const z = lineItems.length >= 4 ? parseFloat(lineItems[3]) : 0.0;

    this.currentModel().vertexNormals.push({ x, y, z });
  }

  parsePolygon(lineItems) {
    const totalVertices = (lineItems.length - 1);
    if (totalVertices < 3) { throw (`Face statement has less than 3 vertices${this.filePath}${this.lineNumber}`); }

    const face = {
      material: this.currentMaterial,
      group: this.currentGroup,
      smoothingGroup: this.smoothingGroup,
      vertices: []
    };

    for (let i = 0; i < totalVertices; i += 1) {
      const vertexString = lineItems[i + 1];
      const vertexValues = vertexString.split('/');

      if (vertexValues.length < 1 || vertexValues.length > 3) { throw (`Too many values (separated by /) for a single vertex${this.filePath}${this.lineNumber}`); }

      let vertexIndex = 0;
      let textureCoordsIndex = 0;
      let vertexNormalIndex = 0;
      vertexIndex = parseInt(vertexValues[0]);
      if (vertexValues.length > 1 && (!vertexValues[1] == '')) { textureCoordsIndex = parseInt(vertexValues[1]); }
      if (vertexValues.length > 2) { vertexNormalIndex = parseInt(vertexValues[2]); }

      if (vertexIndex == 0) { throw 'Faces uses invalid vertex index of 0'; }

      // Negative vertex indices refer to the nth last defined vertex
      // convert these to postive indices for simplicity
      if (vertexIndex < 0) { vertexIndex = this.currentModel().vertices.length + 1 + vertexIndex; }

      face.vertices.push({
        vertexIndex,
        textureCoordsIndex,
        vertexNormalIndex
      });
    }
    this.currentModel().faces.push(face);
  }

  parseMtlLib(lineItems) {
    if (lineItems.length >= 2) { this.result.materialLibraries.push(lineItems[1]); }
  }

  parseUseMtl(lineItems) {
    if (lineItems.length >= 2) { this.currentMaterial = lineItems[1]; }
  }

  parseSmoothShadingStatement(lineItems) {
    if (lineItems.length != 2) { throw 'Smoothing group statements must have exactly 1 argument (eg. s <number|off>)'; }

    const groupNumber = (lineItems[1].toLowerCase() == 'off') ? 0 : parseInt(lineItems[1]);
    this.smoothingGroup = groupNumber;
  }
}
