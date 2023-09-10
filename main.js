import './style.css'


// Navbar
document.querySelector('#app').innerHTML = `
<div id="navbar">
  <header class="header">
    <a href="" class="logo">JsConfMX</a>
    <input class="menu-btn" type="checkbox" id="menu-btn" />
    <label class="menu-icon" for="menu-btn"><span class="navicon"></span></label>
    <ul class="menu">
      <li><a href="#work">Teachable Machine</a></li>
      <li><a href="#about">Coco Ssd</a></li>
    </ul>
  </header>
</div>
<div id="content-body">
  <h1>🐕 or 🐈 </h1>
  <h2>Sube una imagen </h2>
    <input type="file" id="imageInput" accept="image/*">
    <img id="uploadedImage" src="#" alt="Uploaded Image" style="display: none; max-width: 100%;">
    <div id="label-container"></div>
</div> 
`

let model, labelContainer, maxPredictions;
const modelURL = "https://teachablemachine.withgoogle.com/models/P2Wd_6VYy/" + "model.json";
const metadataURL = "https://teachablemachine.withgoogle.com/models/P2Wd_6VYy/" + "metadata.json";

imageInput.addEventListener('change', async function () {
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = async function(e) {
    uploadedImage.src = e.target.result;
    uploadedImage.style.display = 'block';

    const img = new Image();
    img.src = e.target.result;

    await new Promise(resolve => {
      img.onload = () => {
        resolve();
      };
    });

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    const predictions = await model.predict(img);
    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        predictions[i].className + ": " + predictions[i].probability.toFixed(2);
      labelContainer.childNodes[i].innerHTML = classPrediction;
    }
  };

  reader.readAsDataURL(file);
});

