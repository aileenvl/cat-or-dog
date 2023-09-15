import './style.css'
import { confetti } from "https://cdn.jsdelivr.net/npm/tsparticles-confetti/+esm";

const duration = 15 * 1000,
  animationEnd = Date.now() + duration,
  defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

const run = () => {
  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    );
  }, 250);
};


// Navbar
document.querySelector('#app').innerHTML = `
<div id="navbar">
  <header class="header">
    <a href="" class="logo">JsConfMX</a>
    <input class="menu-btn" type="checkbox" id="menu-btn" />
    <label class="menu-icon" for="menu-btn"><span class="navicon"></span></label>
    <ul class="menu">
      <li><a href="#work">Teachable Machine</a></li>
    </ul>
  </header>
</div>
<div id="content-body">
  <div class="content-headers">
    <h1>🐈 or 🐕  </h1>
    <h2>Sube una imagen </h2>
    <input type="file" id="imageInput" accept="image/*">
  </div>
    <img id="uploadedImage" src="#" alt="Uploaded Image" style="display: none; max-width: 300px;">
    <div id="label-container"></div>
</div> 
`
// Define variables for the model, labelContainer, and maxPredictions.
let model, labelContainer, maxPredictions;
// URLs for your machine learning model and metadata.
const modelURL = "https://teachablemachine.withgoogle.com/models/P2Wd_6VYy/" + "model.json";
const metadataURL = "https://teachablemachine.withgoogle.com/models/P2Wd_6VYy/" + "metadata.json";
// Add an event listener to the file input element with id 'imageInput'.
imageInput.addEventListener('change', async function () {
  // Load the machine learning model from the provided URLs.
  model = await tmImage.load(modelURL, metadataURL);
  // Get the total number of classes in the model.
  maxPredictions = model.getTotalClasses();
  // Get the selected file from the file input.
  const file = this.files[0];
  // Create a new FileReader to read the selected image file.
  const reader = new FileReader();
  // This function is executed when the FileReader finishes loading the image.
  reader.onload = async function(e) {
    // Set the 'src' attribute of the 'uploadedImage' element to display the uploaded image.
    uploadedImage.src = e.target.result;
    uploadedImage.style.display = 'block';
    // Create a new Image element to handle the image prediction.
    const img = new Image();
    img.src = e.target.result;
    // Wait for the image to load.
    await new Promise(resolve => {
      img.onload = () => {
        resolve();
      };
    });
    // Get the 'label-container' element where predictions will be displayed.
    labelContainer = document.getElementById("label-container");
    // Create div elements in 'label-container' for each class label
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
    
    // Use the loaded model to predict the contents of the uploaded image.
    const predictions = await model.predict(img);
    // Display the predictions for each class label in 'label-container'.
    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        predictions[i].className + ": " + predictions[i].probability.toFixed(2);
      labelContainer.childNodes[i].innerHTML = classPrediction;
    }
    if(predictions) {
      run();
    }

  };

  reader.readAsDataURL(file);
});

