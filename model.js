let model = null;

function createModel(){
  const cnnSize = Number(document.getElementById('cnnSize').value);
  const mode = document.getElementById('modelMode').value;
  const filters = mode==='optimized'?8:32;
  const layers = mode==='optimized'?2:4;

  const m = tf.sequential();
  m.add(tf.layers.inputLayer({inputShape:[cnnSize,cnnSize,3]}));
  for(let i=0;i<layers;i++){
    m.add(tf.layers.conv2d({filters:filters*(i+1),kernelSize:3,padding:'same',activation:'relu'}));
  }
  m.add(tf.layers.flatten());
  m.add(tf.layers.dense({units:cnnSize*cnnSize*3,activation:'sigmoid'}));
  m.compile({optimizer:'adam',loss:'meanSquaredError'});
  return m;
}

async function trainModel(imgTensor){
  if(!model) model=createModel();
  const epochs = Number(document.getElementById('epochs').value);
  const batch = Number(document.getElementById('batchSize').value);
  await model.fit(imgTensor,imgTensor,{epochs:epochs,batchSize:batch});
  document.getElementById('trainedFlag').textContent='yes';
  document.getElementById('status').textContent='Training complete';
}

async function predictCanvasImage(){
  if(!model){ document.getElementById('status').textContent='No model yet'; return; }
  const cnnSize = Number(document.getElementById('cnnSize').value);
  const drawCanvas = document.getElementById('drawCanvas');
  const predictCanvas = document.getElementById('predictCanvas');
  const ctx = drawCanvas.getContext('2d');
  const pctx = predictCanvas.getContext('2d');

  const imgData = ctx.getImageData(0,0,drawCanvas.width,drawCanvas.height);
  const resized = tf.browser.fromPixels(imgData).resizeNearestNeighbor([cnnSize,cnnSize]).toFloat().div(255).expandDims(0);
  const pred = model.predict(resized);
  const predData = pred.reshape([cnnSize,cnnSize,3]);
  const predPixels = await tf.browser.toPixels(predData);

  const tmp = new ImageData(cnnSize,cnnSize);
  for(let i=0;i<predPixels.length;i++) tmp.data[i]=predPixels[i];
  pctx.putImageData(tmp,0,0);
  document.getElementById('status').textContent='Prediction done';
}
