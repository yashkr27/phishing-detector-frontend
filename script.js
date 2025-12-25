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
  if (validationError.classList.contains("hidden") === false) {
    validationError.classList.add("hidden");
    urlInput.classList.remove("shake");
  }
});

// Validate URL format
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
  
  // Remove shake animation after it completes
  setTimeout(() => {
    urlInput.classList.remove("shake");
  }, 600);
}

// Simulate analysis (replace with actual API call)
function analyzeUrl(url) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock analysis - in reality, this would be an API call
      const isPhishing = Math.random() < 0.5;
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      resolve({
        isPhishing,
        confidence,
        reasons: isPhishing ? [
          "Suspicious domain structure",
          "Recently registered domain",
          "Matches known phishing patterns"
        ] : [
          "Valid SSL certificate",
          "Domain age > 1 year",
          "No known phishing reports"
        ]
      });
    }, 1500); // Simulate network delay
  });
}

// Handle analysis button click
checkBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  
  // Input validation
  if (!url) {
    showValidationError("Please enter a URL to analyze");
    return;
  }
  
  // Basic URL format validation
  if (!url.includes(".") || url.length < 5) {
    showValidationError("Please enter a valid URL (e.g., https://example.com)");
    return;
  }
  
  // Show loading state
  btnText.classList.add("hidden");
  loading.classList.remove("hidden");
  checkBtn.disabled = true;
  
  try {
    // Perform analysis
    const analysis = await analyzeUrl(url);
    
    // Display result
    result.className = analysis.isPhishing ? "phishing" : "safe";
    result.classList.remove("hidden");
    
    // Set result content
    const resultText = result.querySelector(".result-text");
    const resultSubtext = result.querySelector(".result-subtext");
    
    if (analysis.isPhishing) {
      resultText.textContent = "PHISHING LINK DETECTED";
      resultSubtext.innerHTML = `
        Confidence: ${analysis.confidence}%<br>
        ${analysis.reasons.slice(0, 2).join(" • ")}
      `;
    } else {
      resultText.textContent = "LINK APPEARS SAFE";
      resultSubtext.innerHTML = `
        Confidence: ${analysis.confidence}%<br>
        ${analysis.reasons.slice(0, 2).join(" • ")}
      `;
    }
    
  } catch (error) {
    // Handle errors
    result.className = "phishing";
    result.classList.remove("hidden");
    result.querySelector(".result-text").textContent = "ANALYSIS ERROR";
    result.querySelector(".result-subtext").textContent = 
      "Unable to analyze the URL. Please try again.";
  } finally {
    // Reset button state
    btnText.classList.remove("hidden");
    loading.classList.add("hidden");
    checkBtn.disabled = false;
  }
});

// Allow Enter key to trigger analysis
urlInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkBtn.click();
  }
});

// Add focus state for better UX
urlInput.addEventListener("focus", () => {
  urlInput.style.borderColor = "#00c8ff";
});

urlInput.addEventListener("blur", () => {
  urlInput.style.borderColor = "#2a2f36";
});

// Initialize with a sample URL for demo purposes
window.addEventListener("DOMContentLoaded", () => {
  // Uncomment to pre-fill with a sample URL
  // urlInput.value = "https://example.com";
});