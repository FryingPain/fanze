const cursor = document.createElement("script");
cursor.src = "https://unpkg.com/cursor-effects@latest/dist/browser.js";
document.head.appendChild(cursor);

window.addEventListener("load", (event) => {
  cursoreffects.fairyDustCursor({
    colors: ["#e28c00", "#eccd00", "#ffffff", "#62aedc", "#203856"],
  });
  if (new URLSearchParams(window.location.search).get("flag") == "1" || localStorage.getItem("flagenabled") == "true") {
    cursoreffects.rainbowCursor({
      colors: ["#e28c00", "#eccd00", "#ffffff", "#62aedc", "#203856"],
      length: 50,
      size: 5,
    });
  }
});
