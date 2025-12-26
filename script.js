/* ---------------- LIVE THREAT INTEL ---------------- */

const intel = [
  "Phishing emails often spoof trusted brands.",
  "HTTPS does not guarantee a website is safe.",
  "Urgency is a common phishing tactic.",
  "Shortened URLs hide malicious destinations.",
  "Attachments are a frequent malware vector.",
  "Always check the sender's email address carefully.",
  "Look for slight misspellings in domain names.",
  "Unexpected login prompts are often phishing attempts."
];

let intelIndex = 0;
const intelText = document.getElementById("intelText");

function updateIntel() {
  intelText.innerText = intel[intelIndex];
  intelIndex = (intelIndex + 1) % intel.length;
}

setInterval(updateIntel, 4000);
updateIntel();

/* ---------------- RIGHT PANEL BLOCK ROTATION ---------------- */

const blocks = document.querySelectorAll(".info-block");
let blockIndex = 0;

setInterval(() => {
  blocks.forEach(block => block.classList.remove("active"));
  blockIndex = (blockIndex + 1) % blocks.length;
  blocks[blockIndex].classList.add("active");
}, 8000);

/* ---------------- URL ANALYSIS ---------------- */

const urlInput = document.getElementById("urlInput");
const checkBtn = document.getElementById("checkBtn");
const result = document.getElementById("result");
const validationError = document.getElementById("validationError");
const btnText = document.querySelector(".btn-text");
const loading = document.querySelector(".loading");

// Remove validation error when user starts typing
urlInput.addEventListener("input", () => {
  if (!validationError.classList.contains("hidden")) {
    validationError.classList.add("hidden");
    urlInput.classList.remove("shake");
  }
});

// Proper URL validation
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Show validation error
function showValidationError(message) {
  validationError.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  validationError.classList.remove("hidden");
  urlInput.classList.add("shake");

  setTimeout(() => {
    urlInput.classList.remove("shake");
  }, 600);
}

/* ---------------- FASTAPI CALL ---------------- */

async function analyzeUrl(url) {
  const response = await fetch("http://localhost:8000/predict", {
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

  return {
    isPhishing: data.label === "phishing",
    confidence: Math.round(data.confidence * 100),
    reasons: [] // backend can extend later
  };
}

/* ---------------- BUTTON HANDLER ---------------- */

checkBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();

  if (!url) {
    showValidationError("Please enter a URL to analyze");
    return;
  }

  if (!isValidUrl(url)) {
    showValidationError("Please enter a valid URL (e.g., https://example.com)");
    return;
  }

  btnText.classList.add("hidden");
  loading.classList.remove("hidden");
  checkBtn.disabled = true;

  try {
    const analysis = await analyzeUrl(url);

    result.className = analysis.isPhishing ? "phishing" : "safe";
    result.classList.remove("hidden");

    const resultText = result.querySelector(".result-text");
    const resultSubtext = result.querySelector(".result-subtext");

    resultText.textContent = analysis.isPhishing
      ? "PHISHING LINK DETECTED"
      : "LINK APPEARS SAFE";

    resultSubtext.innerHTML = `
      Confidence: ${analysis.confidence}%<br>
      ${analysis.reasons.length ? analysis.reasons.slice(0, 2).join(" • ") : ""}
    `;
  } catch (error) {
    result.className = "phishing";
    result.classList.remove("hidden");
    result.querySelector(".result-text").textContent = "ANALYSIS ERROR";
    result.querySelector(".result-subtext").textContent =
      "Unable to analyze the URL. Please try again.";
  } finally {
    btnText.classList.remove("hidden");
    loading.classList.add("hidden");
    checkBtn.disabled = false;
  }
});

// Enter key support
urlInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkBtn.click();
  }
});

// Focus styling
urlInput.addEventListener("focus", () => {
  urlInput.style.borderColor = "#00c8ff";
});

urlInput.addEventListener("blur", () => {
  urlInput.style.borderColor = "#2a2f36";
});
