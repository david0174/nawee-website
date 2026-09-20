// Small enhancement: mark the page as loaded for a subtle entrance effect.
document.documentElement.classList.add("js");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".card, .about-copy, .principle > div").forEach((el) => {
  el.style.transition = "opacity .6s ease, transform .6s ease";
  el.style.opacity = "0";
  el.style.transform = "translateY(16px)";
  observer.observe(el);
});

const style = document.createElement("style");
style.textContent = ".visible{opacity:1!important;transform:none!important}";
document.head.appendChild(style);
