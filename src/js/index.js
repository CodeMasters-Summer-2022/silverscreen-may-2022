console.log("Hello from JavaScript");
const apiKey = process.env.SILVERSCREEN_TMDB_API_KEY;
console.log({ apiKey });

const menuBtn = document.querySelector(".menu-btn");
const sideNav = document.querySelector(".side-nav");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  sideNav.classList.toggle("side-nav__open");
});
