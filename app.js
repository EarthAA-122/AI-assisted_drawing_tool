/* ============================
 Globals & Elements
============================ */
const drawCanvas = document.getElementById('drawCanvas');
const ctx = drawCanvas.getContext('2d');
const predictCanvas = document.getElementById('predictCanvas');
const pctx = predictCanvas.getContext('2d');

const canvasWidthEl = document.getElementById('canvasWidth');
const canvasHeightEl = document.getElementById('canvasHeight');
const resizeBtn = document.getElementById('resizeBtn');
const pixelSizeSlider = document.getElementById('pixelSizeSlider');
const pixelSizeLabel = document.getElementById('pixelSizeLabel');
const colorPicker = document.getElementById('colorPicker');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const uploadImages = document.getElementById('uploadImages');
const uploadTrainBtn = document.getElementById('uploadTrainBtn');
const predictBtn = document.getElementById('predictBtn');
const datasetCountEl = document.getElementById('datasetCount');
const trainedFlagEl = document.getElementById('trainedFlag');
const statusEl = document.getElementById('status');
const cnnSizeSelect = document.getElementById('cnnSize');
const modelModeSelect = document.getElementById('modelMode');
const epochsEl = document.getElementById('epochs');
const batchSizeEl = document.getElementById('batchSize');
const blendSlider = document.getElementById('blend');
const blendVal = document.getElementById('blendVal');
const saveModelBtn = document.getElementById('saveModelBtn');
const loadModelInput = document.getElementById('loadModelInput');
const downloadFreqBtn = document.getElementById('downloadFreqBtn');
const modeIndicator = document.getElementById('modeIndicator');
const clearCacheBtn = document.getElementById('clearCacheBtn');

const coordX = document.getElementById('coordX');
const coordY = document.getElementById('coordY');
const drawCoordBtn = document.getElementById('drawCoordBtn');

let drawing = false;
let pixelSize = Number(pixelSizeSlider.value);
pixelSizeLabel.textContent = pixelSize;

let dataset = [];
let colorMap = [], positionMap = [], neighborMap = [];
let assistMode = modelModeSelect.value;
let assistActive = true;
let predictionLoopRunning = false;

/* ============================
 Helpers
============================ */
function status(msg){ statusEl.textContent = msg; }
function clampCoord(val,max){ return Math.max(0,Math.min(val,max-1)); }

function ensureMapsSize(w,h){
  for(let y=0;y<h;y++){
    if(!colorMap[y]) colorMap[y]=[];
    if(!positionMap[y]) positionMap[y]=[];
    if(!neighborMap[y]) neighborMap[y]=[];
    for(let x=0;x<w;x++){
      if(!colorMap[y][x]) colorMap[y][x]={};
      if(!positionMap[y][x]) positionMap[y][x]=0;
      if(!neighborMap[y][x]) neighborMap[y][x]=0;
    }
  }
}

/* ============================
 Preferences & Cache
============================ */
function loadPreferences(){
  const prefs = JSON.parse(localStorage.getItem('prefs')||'{}');
  if(prefs.canvasWidth) canvasWidthEl.value=prefs.canvasWidth;
  if(prefs.canvasHeight) canvasHeightEl.value=prefs.canvasHeight;
  if(prefs.pixelSize) { pixelSize=prefs.pixelSize; pixelSizeSlider.value=prefs.pixelSize; pixelSizeLabel.textContent=prefs.pixelSize;}
  if(prefs.color) colorPicker.value=prefs.color;
  if(prefs.cnnSize) cnnSizeSelect.value=prefs.cnnSize;
  if(prefs.modelMode) modelModeSelect.value=prefs.modelMode;
  if(prefs.epochs) epochsEl.value=prefs.epochs;
  if(prefs.batchSize) batchSizeEl.value=prefs.batchSize;
  if(prefs.blend) blendSlider.value=prefs.blend; blendVal.textContent=prefs.blend;
  drawCanvas.width = predictCanvas.width = Number(canvasWidthEl.value);
  drawCanvas.height = predictCanvas.height = Number(canvasHeightEl.value);
  updateModeIndicator();
}
function savePreferences(){
  const prefs = {
    canvasWidth:Number(canvasWidthEl.value),
    canvasHeight:Number(canvasHeightEl.value),
    pixelSize:pixelSize,
    color:colorPicker.value,
    cnnSize:cnnSizeSelect.value,
    modelMode:modelModeSelect.value,
    epochs:Number(epochsEl.value),
    batchSize:Number(batchSizeEl.value),
    blend:Number(blendSlider.value)
  };
  localStorage.setItem('prefs', JSON.stringify(prefs));
}

clearCacheBtn.addEventListener('click', ()=>{
  if(confirm('⚠️ Clear all preferences and cached data?')){
    localStorage.clear();
    alert('Cache cleared. Reloading page.');
    location.reload();
  }
});

/* ============================
 Mode Indicator
============================ */
function updateModeIndicator(){
  assistMode = modelModeSelect.value;
  modeIndicator.textContent = `Mode: ${assistMode==='optimized'?'FAST 🟢':'ACCURATE 🔵'}`;
}
modelModeSelect.addEventListener('change', updateModeIndicator);

/* ============================
 Canvas Drawing
============================ */
function getPos(e){
  const rect = drawCanvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: clientX-rect.left, y: clientY-rect.top };
}
function startDraw(e){ drawing=true; draw(e); }
function stopDraw(){ drawing=false; }
function draw(e){
  if(!drawing) return;
  e.preventDefault();
  const p=getPos(e);
  ctx.fillStyle=colorPicker.value;
  ctx.fillRect(p.x-pixelSize/2,p.y-pixelSize/2,pixelSize,pixelSize);
  updateFrequencyMaps();
}
drawCanvas.addEventListener('mousedown', startDraw);
drawCanvas.addEventListener('mousemove', draw);
drawCanvas.addEventListener('mouseup', stopDraw);
drawCanvas.addEventListener('mouseout', stopDraw);
drawCanvas.addEventListener('touchstart', startDraw,{passive:false});
drawCanvas.addEventListener('touchmove', draw,{passive:false});
drawCanvas.addEventListener('touchend', stopDraw);

/* ============================
 Frequency Maps
============================ */
function updateFrequencyMaps(){
  const w = drawCanvas.width;
  const h = drawCanvas.height;
  ensureMapsSize(w,h);
  const imgData = ctx.getImageData(0,0,w,h).data;

  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const idx = (y*w+x)*4;
      const r=imgData[idx],g=imgData[idx+1],b=imgData[idx+2],a=imgData[idx+3];
      const hex = a===0?'#ffffff':`#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}`;
      colorMap[y][x][hex] = (colorMap[y][x][hex]||0)+1;
      positionMap[y][x] = (positionMap[y][x]||0) + (a>0?1:0);
      let sameCount=0,total=0;
      for(let ny=Math.max(0,y-1);ny<=Math.min(h-1,y+1);ny++){
        for(let nx=Math.max(0,x-1);nx<=Math.min(w-1,x+1);nx++){
          if(nx===x && ny===y) continue;
          total++;
          const nidx=(ny*w+nx)*4;
          if(imgData[nidx]===r && imgData[nidx+1]===g && imgData[nidx+2]===b) sameCount++;
        }
      }
      neighborMap[y][x] = (neighborMap[y][x]||0) + (sameCount/total)*100;
    }
  }
}

/* ============================
 Buttons
============================ */
submitBtn.addEventListener('click',()=>{
  updateFrequencyMaps();
  const w=drawCanvas.width,h=drawCanvas.height;
  const imgTensor = tf.browser.fromPixels(ctx.getImageData(0,0,w,h)).toFloat().div(255).expandDims(0);
  dataset.push(imgTensor);
  datasetCountEl.textContent=dataset.length;
  trainModel(imgTensor);
});

clearBtn.addEventListener('click',()=>{ 
  ctx.clearRect(0,0,drawCanvas.width,drawCanvas.height); 
  status('Canvas cleared'); 
});

predictBtn.addEventListener('click',()=>{ predictCanvasImage(); });

saveModelBtn.addEventListener('click', async ()=>{
  if(!model) return alert('No model to save');
  await model.save('downloads://generative-learner-model');
});

loadModelInput.addEventListener('change', async (e)=>{
  if(e.target.files.length===0) return;
  const files = e.target.files;
  model = await tf.loadLayersModel(tf.io.browserFiles(files));
  trainedFlagEl.textContent='yes';
  status('Model loaded');
});

downloadFreqBtn.addEventListener('click',()=>{
  const data = {colorMap,positionMap,neighborMap};
  const blob = new Blob([JSON.stringify(data)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download='frequencyMaps.json'; a.click();
  URL.revokeObjectURL(url);
});

uploadTrainBtn.addEventListener('click',()=>{
  const files = uploadImages.files;
  if(files.length===0) return alert('No files selected');
  Array.from(files).forEach(file=>{
    const reader = new FileReader();
    reader.onload=(e)=>{
      const img = new Image();
      img.onload=()=>{
        ctx.clearRect(0,0,drawCanvas.width,drawCanvas.height);
        ctx.drawImage(img,0,0,drawCanvas.width,drawCanvas.height);
        updateFrequencyMaps();
        const imgTensor = tf.browser.fromPixels(ctx.getImageData(0,0,drawCanvas.width,drawCanvas.height)).toFloat().div(255).expandDims(0);
        dataset.push(imgTensor);
        datasetCountEl.textContent=dataset.length;
        trainModel(imgTensor);
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  });
});

/* ============================
 Canvas Resize & Pixel Size
============================ */
resizeBtn.addEventListener('click',()=>{
  drawCanvas.width = predictCanvas.width = Number(canvasWidthEl.value);
  drawCanvas.height = predictCanvas.height = Number(canvasHeightEl.value);
  ensureMapsSize(drawCanvas.width,drawCanvas.height);
  status('Canvas resized');
});

pixelSizeSlider.addEventListener('input',()=>{
  pixelSize = Number(pixelSizeSlider.value);
  pixelSizeLabel.textContent=pixelSize;
});

blendSlider.addEventListener('input',()=>{ blendVal.textContent=blendSlider.value; });

/* ============================
 Coordinate Input
============================ */
function drawCoordPreview(){
  const x = clampCoord(Number(coordX.value), drawCanvas.width);
  const y = clampCoord(Number(coordY.value), drawCanvas.height);
  pctx.clearRect(0,0,predictCanvas.width,predictCanvas.height);
  pctx.fillStyle=colorPicker.value;
  pctx.globalAlpha=0.4;
  pctx.fillRect(x-pixelSize/2,y-pixelSize/2,pixelSize,pixelSize);
  pctx.globalAlpha=1.0;
}
coordX.addEventListener('input',drawCoordPreview);
coordY.addEventListener('input',drawCoordPreview);

drawCoordBtn.addEventListener('click',()=>{
  const x = clampCoord(Number(coordX.value), drawCanvas.width);
  const y = clampCoord(Number(coordY.value), drawCanvas.height);
  ctx.fillStyle=colorPicker.value;
  ctx.fillRect(x-pixelSize/2,y-pixelSize/2,pixelSize,pixelSize);
  updateFrequencyMaps();
  status(`Pixel drawn at (${x},${y})`);
});

/* ============================
 Initialize
============================ */
loadPreferences();
status('Ready');
