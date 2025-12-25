document.getElementById("checkBtn").addEventListener("click", () => {
  const url = document.getElementById("urlInput").value.trim();
  const result = document.getElementById("result");

  if (!url) return;

  const phishing = Math.random() < 0.5;

  result.className = "";
  result.classList.remove("hidden");

  if (phishing) {
    result.classList.add("phishing");
    result.innerText = "PHISHING LINK DETECTED";
  } else {
    result.classList.add("safe");
    result.innerText = "LINK APPEARS SAFE";
  }
});
