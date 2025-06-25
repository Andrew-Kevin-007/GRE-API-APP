document.addEventListener("DOMContentLoaded", () => {
  const wordCard = document.querySelector(".word-card");
  wordCard.classList.add("fade-in", "slide-up");

  let currentWordData = {};

  fetch("https://gre-prep-app.onrender.com/api/word")

    .then(res => res.json())
    .then(data => {
      currentWordData = data;
      document.getElementById("word").textContent = data.word;
      document.getElementById("definition").textContent = `Definition: ${data.definition}`;
      document.getElementById("mnemonic").textContent = `Mnemonic: ${data.mnemonic}`;
      document.getElementById("example").textContent = `Example: ${data.example}`;
    })
    .catch(err => {
      console.error("Failed to fetch word:", err);
      alert("Error loading word. Please try again.");
    });

  document.getElementById("learned").addEventListener("click", () => {
    if (!currentWordData.word) return;

    fetch("https://gre-prep-app.onrender.com/api/learned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentWordData)
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Word marked as learned!");
      animateButton("learned");
    })
    .catch(err => {
      console.error("Failed to save word:", err);
      alert("Error saving word.");
    });
  });

  document.getElementById("review").addEventListener("click", () => {
    alert("Saved for review!");
    animateButton("review");
  });

  function animateButton(id) {
    const btn = document.getElementById(id);
    btn.style.transform = "scale(1.1)";
    setTimeout(() => btn.style.transform = "scale(1)", 150);
  }
});
