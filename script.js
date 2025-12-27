/* ---------------- FASTAPI CALL ---------------- */

async function analyzeUrl(url) {
  const response = await fetch("http://127.0.0.1:8000/predict", {
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
    reasons: []
  };
}

/* ---------------- BUTTON HANDLER ---------------- */

const urlInput = document.getElementById("urlInput");
const checkBtn = document.getElementById("checkBtn");
const result = document.getElementById("result");
const validationError = document.getElementById("validationError");
const btnText = document.querySelector(".btn-text");
const loading = document.querySelector(".loading");

checkBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();

  if (!url) {
    validationError.classList.remove("hidden");
    return;
  }

  btnText.classList.add("hidden");
  loading.classList.remove("hidden");
  checkBtn.disabled = true;

  try {
    const analysis = await analyzeUrl(url);

    result.className = analysis.isPhishing ? "phishing" : "safe";
    result.classList.remove("hidden");

    result.querySelector(".result-text").textContent =
      analysis.isPhishing ? "PHISHING LINK DETECTED" : "LINK APPEARS SAFE";

    result.querySelector(".result-subtext").innerHTML =
      `Confidence: ${analysis.confidence}%`;

  } catch (err) {
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
