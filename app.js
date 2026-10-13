const viewerCount = document.querySelector(".site-viewer-count");
const viewerCountUrl = "https://api.visitorbadge.io/api/visitors?path=alice-yql.github.io%2Fpersonal-website-v2&label=&countColor=%23f5b229";

fetch(viewerCountUrl, { cache: "no-store" })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Visitor counter request failed with status ${response.status}.`);
    }
    return response.text();
  })
  .then((svg) => {
    const document = new DOMParser().parseFromString(svg, "image/svg+xml");
    const count = document.querySelector("title")?.textContent?.trim();
    if (!count || !/^\d+$/.test(count)) {
      throw new Error("Visitor counter returned an invalid count.");
    }
    viewerCount.textContent = count;
    viewerCount.setAttribute("aria-label", `${count} site views`);
  })
  .catch((error) => {
    viewerCount.textContent = "—";
    viewerCount.setAttribute("aria-label", "Site view count unavailable");
    console.error("Unable to load the site view count.", error);
  });

const cursorGlow = document.querySelector(".cursor-glow");

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.addEventListener("pointermove", (event) => {
    cursorGlow.style.setProperty("--cursor-x", `${event.clientX}px`);
    cursorGlow.style.setProperty("--cursor-y", `${event.clientY}px`);
    cursorGlow.classList.add("cursor-glow--visible");
  });

  document.addEventListener("pointerleave", () => {
    cursorGlow.classList.remove("cursor-glow--visible");
  });
}

const starMessages = window.starMessages;
if (!Array.isArray(starMessages) || starMessages.length === 0 || starMessages.some((message) => typeof message !== "string" || message.trim() === "")) {
  throw new Error("star-messages.js must define window.starMessages as a non-empty array of messages.");
}

const starHint = document.querySelector("#star-hint");
const dismissStarHint = () => {
  starHint.hidden = true;
};

document.querySelectorAll(".star-field .floating-star").forEach((star) => {
  star.addEventListener("pointerenter", dismissStarHint, { once: true });
  star.addEventListener("focus", dismissStarHint, { once: true });
});

const inbox = document.querySelector(".inbox-control");
const inboxMessages = inbox.querySelector(".inbox-messages");
const inboxEmptyMessage = inbox.querySelector(".inbox-empty");
const discoveredStarMessages = new Set();

const rememberStarMessage = (message) => {
  if (discoveredStarMessages.has(message)) {
    return;
  }

  discoveredStarMessages.add(message);
  const messageItem = document.createElement("li");
  messageItem.textContent = message;
  inboxMessages.append(messageItem);
  inboxEmptyMessage.hidden = true;
};

document.querySelectorAll(".floating-star").forEach((star) => {
  const bubble = star.querySelector(".star-bubble");
  const showMessage = () => {
    const randomIndex = Math.floor(Math.random() * starMessages.length);
    const message = starMessages[randomIndex];
    bubble.textContent = message;
    rememberStarMessage(message);
    star.classList.add("floating-star--message-visible");
  };
  const hideMessage = () => {
    star.classList.remove("floating-star--message-visible");
  };

  star.addEventListener("pointerenter", showMessage);
  star.addEventListener("pointerleave", () => {
    if (!star.matches(":focus")) {
      hideMessage();
    }
  });
  star.addEventListener("focus", showMessage);
  star.addEventListener("blur", hideMessage);
  star.addEventListener("click", showMessage);
});

document.querySelectorAll(".menu-panel a").forEach((link) => {
  link.addEventListener("click", () => {
    link.closest(".site-menu").open = false;
  });
});

document.querySelectorAll(".dish-button, .menu-panel-item").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".site-menu")?.removeAttribute("open");
    document.getElementById(button.dataset.dialog).showModal();
  });
});

const interestCarousel = document.querySelector(".interest-carousel");
const interestSlides = [...interestCarousel.querySelectorAll(".interest-slide")];
const interestCarouselCount = interestCarousel.querySelector(".interest-carousel-count");
let activeInterestSlide = 0;

const showInterestSlide = (index) => {
  activeInterestSlide = (index + interestSlides.length) % interestSlides.length;
  interestSlides.forEach((slide, slideIndex) => {
    slide.hidden = slideIndex !== activeInterestSlide;
  });
  interestCarouselCount.textContent = `${activeInterestSlide + 1} / ${interestSlides.length}`;
};

interestCarousel.querySelectorAll(".interest-carousel-arrow").forEach((button) => {
  button.addEventListener("click", () => {
    showInterestSlide(activeInterestSlide + Number(button.dataset.carouselDirection));
  });
});

interestCarousel.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showInterestSlide(activeInterestSlide + (event.key === "ArrowRight" ? 1 : -1));
  }
});

const confettiLayer = document.createElement("div");
confettiLayer.className = "cart-confetti-layer";
confettiLayer.setAttribute("aria-hidden", "true");
document.body.append(confettiLayer);

const burstConfetti = (button) => {
  const bounds = button.getBoundingClientRect();
  const colors = ["#ee361d", "#f5b229", "#536e78", "#c9b9d1"];

  for (let index = 0; index < 18; index += 1) {
    const piece = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 24 + Math.random() * 52;

    piece.className = "cart-confetti-piece";
    piece.style.setProperty("--confetti-left", `${bounds.left + bounds.width / 2}px`);
    piece.style.setProperty("--confetti-top", `${bounds.top + bounds.height / 2}px`);
    piece.style.setProperty("--confetti-x", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--confetti-y", `${Math.sin(angle) * distance}px`);
    piece.style.setProperty("--confetti-rotation", `${Math.random() * 540 - 270}deg`);
    piece.style.setProperty("--confetti-color", colors[index % colors.length]);
    confettiLayer.append(piece);
    window.setTimeout(() => piece.remove(), 800);
  }
};

// Checkout counter
const checkoutReceipt = document.querySelector(".checkout-receipt");
document.querySelectorAll(".dish-cart-button").forEach((button) => {
  button.addEventListener("click", () => {
    burstConfetti(button);
    const item = button.dataset.cartItem;
    const existingRow = [...checkoutReceipt.querySelectorAll("[data-receipt-item]")]
      .find((row) => row.dataset.receiptItem === item);

    if (existingRow) {
      const quantity = Number(existingRow.dataset.quantity) + 1;
      existingRow.dataset.quantity = String(quantity);
      existingRow.querySelector(".checkout-quantity").textContent = `${quantity} ×`;
      return;
    }

    const row = document.createElement("div");
    row.className = "checkout-order";
    row.dataset.receiptItem = item;
    row.dataset.quantity = "1";

    const quantity = document.createElement("span");
    quantity.className = "checkout-quantity";
    quantity.textContent = "1 ×";

    const name = document.createElement("span");
    name.textContent = item;

    const heart = document.createElement("span");
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "♡";

    row.append(quantity, name, heart);
    checkoutReceipt.append(row);
  });
});


/* ================ COOKIE COUNTER!!!!!!! ================ */

const cookiePlate = document.querySelector(".cookie-plate");
const cookiePlateImage = cookiePlate.querySelector("img");
const cookieStatus = document.querySelector(".cookie-status");
let cookiesRemaining = 3;

cookiePlate.addEventListener("click", () => {
  if (cookiesRemaining === 0) {
    cookiePlate.setAttribute("aria-label", "Empty plate, no cookies left");
    cookieStatus.textContent = "please stop...that's all i got!";
    return;
  }

  cookiesRemaining -= 1;
  cookiePlateImage.src = `assets/contact/cookies${cookiesRemaining}.PNG`;

  if (cookiesRemaining === 0) {
    cookiePlate.setAttribute("aria-label", "Empty plate, no cookies left");
    cookieStatus.textContent = "you ate all the cookies!";
    return;
  }

  const cookieText = cookiesRemaining === 1 ? "cookie" : "cookies";
  cookiePlate.setAttribute("aria-label", `take a cookie, ${cookiesRemaining} ${cookieText} left.`);
  cookieStatus.textContent = `${cookiesRemaining} ${cookieText} left!`;
});

/* ============= */

const experienceTabs = [...document.querySelectorAll(".experience-tab")];

experienceTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    experienceTabs.forEach((experienceTab) => {
      const selected = experienceTab === tab;
      experienceTab.setAttribute("aria-selected", String(selected));
      experienceTab.tabIndex = selected ? 0 : -1;
      document.getElementById(experienceTab.getAttribute("aria-controls")).hidden = !selected;
    });
  });

  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % experienceTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + experienceTabs.length) % experienceTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = experienceTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    experienceTabs[nextIndex].click();
    experienceTabs[nextIndex].focus();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelector(".dish-dialog[open]")?.close();
  }
});

document.querySelectorAll(".dish-dialog").forEach((dialog) => {
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});
