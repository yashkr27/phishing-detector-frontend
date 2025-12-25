/* ---------------- LIVE THREAT INTEL ---------------- */

const intel = [
  "Phishing emails often spoof trusted brands.",
  "HTTPS does not guarantee a website is safe.",
  "Urgency is a common phishing tactic.",
  "Shortened URLs hide malicious destinations.",
  "Attachments are a frequent malware vector."
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
}, 7000);

/* ---------------- MOCK ANALYSIS RESULT ---------------- */

document.getElementById("checkBtn").addEventListener("click", () => {
  const url = document.getElementById("urlInput").value.trim();
  const result = document.getElementById("result");

  if (!url) return;

  const phishing = Math.random() < 0.5;

  result.className = phishing ? "phishing" : "safe";
  result.innerText = phishing
    ? "PHISHING LINK DETECTED"
    : "LINK APPEARS SAFE";

  result.classList.remove("hidden");
});
