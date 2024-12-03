document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const canvas = document.getElementById("scratchCanvas");
  const ctx = canvas.getContext("2d");
  const hiddenPrize = document.getElementById("hiddenPrize");
  const claimButton = document.getElementById("claimButton");

  const confirmationPopup = document.getElementById('confirmationPopup');
const confirmClaimButton = document.getElementById('confirmClaimButton');
const cancelClaimButton = document.getElementById('cancelClaimButton');

  // Set canvas size to match the container
  canvas.width = hiddenPrize.offsetWidth;
  canvas.height = hiddenPrize.offsetHeight;

  // Create a scratchable overlay
  ctx.fillStyle = "#b0bec5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 18px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Scratch here", canvas.width / 2, canvas.height / 2);

  let isScratching = false;

  // Get position relative to canvas
  function getEventPosition(event) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (event.touches) {
      const touch = event.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    return { x, y };
  }

  // Start scratching
  function startScratch(event) {
    isScratching = true;
    scratch(event);
  }

  // Stop scratching
  function stopScratch() {
    isScratching = false;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const scratchedPixels = Array.from(pixels).filter((pixel, index) => index % 4 === 3 && pixel < 255).length;

    if (scratchedPixels / (canvas.width * canvas.height) > 0.5) {
      canvas.style.display = "none";
    }
  }

  // Perform scratching
  function scratch(event) {
    if (!isScratching) return;

    const { x, y } = getEventPosition(event);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  // Event listeners for mouse
  canvas.addEventListener("mousedown", startScratch);
  canvas.addEventListener("mouseup", stopScratch);
  canvas.addEventListener("mousemove", scratch);

  // Event listeners for touch
  canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    startScratch(event);
  });
  canvas.addEventListener("touchend", (event) => {
    event.preventDefault();
    stopScratch();
  });
  canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    scratch(event);
  });

  // Handle the claim button click
  claimButton.addEventListener("click", () => {
    verificationPopup.classList.remove("hidden"); // Make popup visible
    startVerificationTimer(); // Start the timer
  });
  
  // Verification timer
  function startVerificationTimer() {
    let timeRemaining = 30;
    const interval = 1000;
    const progressBarStep = 100 / timeRemaining;

    const timerInterval = setInterval(() => {
      timeRemaining--;
      timerDisplay.textContent = `${timeRemaining} seconds remaining`;
      progressBarFill.style.width = `${progressBarStep * (30 - timeRemaining)}%`;

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "Verification complete!";
        setTimeout(() => {
          verificationPopup.classList.add("hidden");
          alert("Your claim has been verified!");
        }, 1000);
      }
    }, interval);
  }
});
document.getElementById("claimButton").addEventListener("click", function () {
  const modal = document.getElementById("verificationModal");
  const progressBar = document.getElementById("progressBar");
  const timerText = document.getElementById("timerText");
  let timeLeft = 30;

  // Show the modal
  modal.style.display = "flex";

  // Initialize the progress bar and timer
  progressBar.style.width = "0%";
  timerText.textContent = `${timeLeft} seconds remaining`;

  // Start the timer and progress bar animation
  const interval = setInterval(() => {
    timeLeft--;
    progressBar.style.width = `${(30 - timeLeft) * 100 / 30}%`;
    timerText.textContent = `${timeLeft} seconds remaining`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      modal.style.display = "none";
    }
  }, 1000);
});
document.getElementById("claimButton").addEventListener("click", function () {
  const verificationModal = document.getElementById("verificationModal");
  const successModal = document.getElementById("successModal");
  const progressBar = document.getElementById("progressBar");
  const timerText = document.getElementById("timerText");
  let timeLeft = 30;

  // Show verification modal
  verificationModal.style.display = "flex";
  progressBar.style.width = "0%";
  timerText.textContent = `${timeLeft} seconds remaining`;

  // Timer for verification
  const interval = setInterval(() => {
    timeLeft--;
    progressBar.style.width = `${(30 - timeLeft) * 100 / 30}%`;
    timerText.textContent = `${timeLeft} seconds remaining`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      verificationModal.style.display = "none";

      // Show success modal
      successModal.style.display = "flex";
    }
  }, 1000);
});

// Copy Redeem Code
document.getElementById("copyButton").addEventListener("click", function () {
  const redeemCode = document.getElementById("redeemCode").textContent;

  // Copy to clipboard
  navigator.clipboard.writeText(redeemCode).then(() => {
    alert("Redeem Code copied to clipboard!");
  });
});

document.getElementById("scratchAgainButton").addEventListener("click", function () {
  const successModal = document.getElementById("successModal");
  const redeemCodeElement = document.getElementById("redeemCode");
  const scratchTimer = document.getElementById("scratchTimer");
  const countdownTimer = document.getElementById("countdownTimer");
  const scratchAgainButton = document.getElementById("scratchAgainButton");
  const copyButton = document.getElementById("copyButton");
  const congratulationsText = successModal.querySelector("h2");
  const redeemCodeText = successModal.querySelector("p:nth-child(2)");
  let countdown = 24 * 60 * 60; // 24 hours in seconds

  // Hide the success message and associated texts
  congratulationsText.style.display = "none";
  redeemCodeText.style.display = "none";
  redeemCodeElement.style.display = "none";
  copyButton.style.display = "none";
  scratchAgainButton.style.display = "none";

  // Show timer
  scratchTimer.classList.remove("hidden");

  // Start the countdown
  const countdownInterval = setInterval(() => {
    countdown--;

    // Format countdown in HH:MM:SS
    const hours = String(Math.floor(countdown / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((countdown % 3600) / 60)).padStart(2, "0");
    const seconds = String(countdown % 60).padStart(2, "0");
    countdownTimer.textContent = `${hours}h ${minutes}m ${seconds}s`;

    if (countdown <= 0) {
      clearInterval(countdownInterval);

      // Reset the modal for a new scratch session
      scratchTimer.classList.add("hidden");
      congratulationsText.style.display = "block";
      redeemCodeText.style.display = "block";
      redeemCodeElement.style.display = "block";
      copyButton.style.display = "block";
      scratchAgainButton.style.display = "block";
      alert("You can now scratch again!");
    }
  }, 1000);
});
