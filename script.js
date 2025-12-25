document.getElementById("checkBtn").addEventListener("click", () => {
  const url = document.getElementById("urlInput").value;
  document.getElementById("status").innerText =
    url ? "Ready to send URL to backend" : "Please enter a URL";
});
