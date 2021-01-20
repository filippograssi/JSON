function CreateInputHandling(scene) {
    var inputManager = new InputManager();
    var priorX = inputManager.pointerX;
    var priorY = inputManager.pointerY;
    var x = 0;
    var y = 0;
    scene.onBeforeRenderObservable.add(function () {
        x = inputManager.pointerX;
        y = inputManager.pointerY;

        if (inputManager.isPointerDown) {
            scene.activeCamera.alpha += 0.01 * (priorX - x);
            scene.activeCamera.beta += 0.01 * (priorY - y);
        }

        priorX = x;
        priorY = y;
    });
}

var createScene = function () {


// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);

// This creates and positions a free camera (non-mesh)
// Create a rotating camera
var camera = new BABYLON.ArcRotateCamera("Camera", 1.9, 5.0, 120, new BABYLON.Vector3(15, 15, 0), scene);

// Attach it to handle user inputs (keyboard, mouse, touch)
//camera.attachControl(canvas, false);

// This targets the camera to scene origin
camera.setTarget(BABYLON.Vector3.Zero());


// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;
var myColors = new Array(6);

var baseBlocks = [];

['mountain', 'hill', 'grass', 'water'].forEach(function (block) {
if( block == "mountain")
{
myColors[4] = new BABYLON.Color4(0,0,0,1);
} else if (block === "hill") {
myColors[4] = new BABYLON.Color4(1,1,0,1);
} else if (block === "water") {
myColors[4] = new BABYLON.Color4(0,1,0,1);
} else {
myColors[4] = new BABYLON.Color4(0,1,1,1);
}
var box = BABYLON.MeshBuilder.CreateBox("box", {height: 5, width:5, depth:5, faceColors: myColors}, scene);
box.enableEdgesRendering();
box.edgesWidth = 4.0;
box.edgesColor = new BABYLON.Color4(0, 0, 1, 1);

box.position.y = -1 * 5;
box.position.x = -1 * 5;
box.position.z = -1 * 5;
baseBlocks.push(box);
});



//var gltf = "http://localhost/prova/amico2.json";
//var gltf = "app:///Scripts/prova.json";
var gltf = "https://raw.githubusercontent.com/filippograssi/Story/main/amico2.json";
var ra = BABYLON.SceneLoader.Load(gltf);
//var gltf = "app:///C:\Users\983012\Desktop\BabylonNative\Apps\Playground\Android\app\src\main\assets\Scripts/amico2.json";
//var gltf = "app:///C:/Users/983012/Desktop/BabylonNative/Apps/Playground/Android/app/src/main/assets/Scripts/amico2.json";
//var gltf = "file:///Scripts/prova.json";
var xmlHttp = new XMLHttpRequest();

var arrayOfMeshes = [];

xmlHttp.onreadystatechange = function()
{
if (this.readyState == xmlHttp.DONE && this.status == 200)
{
    var out = JSON.parse(this.responseText);

    mapBlocks = out.map;
    mapBlocks.forEach(function (block) {
      if( block.type == "mountain")
      {
        var newClone = baseBlocks[0].clone();
      } else if (block.type === "hill") {
        var newClone = baseBlocks[1].clone();
      } else if (block.type === "water") {
        var newClone = baseBlocks[2].clone();
      } else {
        var newClone = baseBlocks[3].clone();
      }

        // Move the sphere upward 1/2 its height
      newClone.position.y = block.y * 5; //+ ( 5 * $y );
      newClone.position.x = block.x * 5;
      newClone.position.z = block.z * 5;
      newClone.enableEdgesRendering();
      newClone.edgesWidth = 1.0;
      newClone.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
      arrayOfMeshes.push(newClone);
    });


      var newMesh = BABYLON.Mesh.MergeMeshes(arrayOfMeshes);
        newMesh.enableEdgesRendering();
        newMesh.edgesWidth = 4.0;
        newMesh.edgesColor = new BABYLON.Color4(0, 0, 1, 1);

      }
};
xmlHttp.open("GET", ra, true);
xmlHttp.send();


CreateInputHandling(scene);
return scene;

};

function getRandomInt(min, max) {
num = Math.random() * (max - min) + min;
return num;
}

/*
 canvas.addEventListener('contextmenu', function(e) {
      if (e.button === 2) {
       e.preventDefault();
        return false;
      }
  }, false);
  */
