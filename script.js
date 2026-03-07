/* ---------------- CONFIG ---------------- */

// Use the production URL for both local and live entornos to avoid local backend dependency
const API_ENDPOINT = "https://phishing-detection-api-n362.onrender.com/predict";
// const API_ENDPOINT = "http://127.0.0.1:8000/predict"; // For local debugging with a running API

/* ---------------- FASTAPI CALL ---------------- */

async function analyzeUrl(url) {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });

  if (!response.ok) {
    throw new Error("Backend error");
  }

  const data = await response.json();

  const isPhishing = data.label === "phishing";

  // data.confidence is the raw phishing probability (0.0 – 1.0).
  // Flip it for legitimate results so confidence always reflects
  // how sure the model is about its own prediction.
  const rawProb = isPhishing ? data.confidence : (1 - data.confidence);

  // Snap to nearest 10% increment (0, 10, 20 … 100).
  // Minimum display is 10% so we never show "0% confidence".
  const snapped = Math.max(10, Math.round(rawProb * 10) * 10);

  return {
    isPhishing,
    confidence: snapped,
    reasons: []
  };
}

/* ---------------- UI ELEMENTS ---------------- */

const urlInput = document.getElementById("urlInput");
const checkBtn = document.getElementById("checkBtn");
const result = document.getElementById("result");
const validationError = document.getElementById("validationError");
const btnText = document.querySelector(".btn-text");
const loading = document.querySelector(".loading");
const intelText = document.getElementById("intelText");
const infoBlocks = document.querySelectorAll(".info-block");

/* ---------------- HELPERS ---------------- */

function normalizeUrl(string) {
  // If input has no protocol, prepend https://
  if (!/^https?:\/\//i.test(string)) {
    return "https://" + string;
  }
  return string;
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function updateIntelStrip() {
  const threats = [
    "New lookalike domain detected: g00gle-security.com",
    "Increasing PayPal credential harvesting campaigns in EU",
    "Microsoft 365 spoofing wave reported by security analysts",
    "QR-code phishing vulnerability found in public transit systems",
    "Shortened URL abuse up 15% this week"
  ];
  let ix = 0;
  setInterval(() => {
    intelText.style.opacity = 0;
    setTimeout(() => {
      intelText.textContent = threats[ix];
      intelText.style.opacity = 0.6;
      ix = (ix + 1) % threats.length;
    }, 500);
  }, 4000);

  // Initial set
  intelText.textContent = threats[0];
}

function rotateCarousel() {
  let activeIndex = 0;
  setInterval(() => {
    infoBlocks[activeIndex].classList.remove("active");
    activeIndex = (activeIndex + 1) % infoBlocks.length;
    infoBlocks[activeIndex].classList.add("active");
  }, 6000);
}

/* ---------------- HANDLERS ---------------- */

const handleAnalysis = async () => {
  let url = normalizeUrl(urlInput.value.trim());
  urlInput.value = url; // Show normalized URL in the input box

  // Reset UI
  validationError.classList.add("hidden");
  result.classList.add("hidden");

  if (!url) {
    validationError.textContent = "Please enter a URL to analyze";
    validationError.classList.remove("hidden");
    return;
  }

  if (!isValidUrl(url)) {
    validationError.textContent = "Please enter a valid URL (e.g., https://example.com)";
    validationError.classList.remove("hidden");
    return;
  }

  // Loading state
  btnText.classList.add("hidden");
  loading.classList.remove("hidden");
  checkBtn.disabled = true;

  try {
    const analysis = await analyzeUrl(url);

    // Set classes carefully
    result.classList.remove("hidden", "phishing", "safe", "error");
    result.classList.add(analysis.isPhishing ? "phishing" : "safe");

    result.querySelector(".result-text").textContent =
      analysis.isPhishing ? "PHISHING LINK DETECTED" : "LINK APPEARS SAFE";

    result.querySelector(".result-subtext").innerHTML =
      `Confidence: ${analysis.confidence}%`;

  } catch (err) {
    result.classList.remove("hidden", "safe", "phishing");
    result.classList.add("error");
    result.querySelector(".result-text").textContent = "ANALYSIS ERROR";
    result.querySelector(".result-subtext").textContent =
      "Unable to analyze the URL. Please check your connection or try again later.";
  } finally {
    btnText.classList.remove("hidden");
    loading.classList.add("hidden");
    checkBtn.disabled = false;
  }
};

/* ---------------- INIT ---------------- */

checkBtn.addEventListener("click", handleAnalysis);

urlInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleAnalysis();
});

// Start animations
updateIntelStrip();
rotateCarousel();