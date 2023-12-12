"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const header = document.querySelector(".header");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => {
  btn.addEventListener("click", openModal);
});
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//learn more button scroll
btnScrollTo.addEventListener("click", function (e) {
  // const s1coords = section1.getBoundingClientRect();
  //scrolling
  //old school way to set btnScrollTo
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });
  section1.scrollIntoView({ behavior: "smooth" });
});
//Page Navigation
// document.querySelectorAll(".nav__link").forEach((el) => {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const getIdName = this.getAttribute("href");
//     document
//       .querySelector(`${getIdName}`)
//       .scrollIntoView({ behavior: "smooth" });
//   });
// });
//event delegation - imptove performance
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  //matching strategy - to make the target only match when it contains nav__link instead of links
  if (e.target.classList.contains("nav__link")) {
    const getIdName = e.target.getAttribute("href");
    document
      .querySelector(`${getIdName}`)
      .scrollIntoView({ behavior: "smooth" });
  }
});

//Tabbed component
tabsContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const clicked = e.target.closest(".operations__tab");
  //guard clause
  if (!clicked) return;

  //enable the active tab
  tabs.forEach((el) => {
    el.classList.remove("operations__tab--active");
  });
  clicked.classList.add("operations__tab--active");

  //active content

  tabsContent.forEach((el) => {
    el.classList.remove("operations__content--active");
  });
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//Navigation fade animation

const hoverHandler = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const linkClicked = e.target;
    const siblings = linkClicked.closest(".nav").querySelectorAll(".nav__link");

    const logo = linkClicked.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el == linkClicked) return;

      el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener("mouseover", hoverHandler.bind(0.5));
nav.addEventListener("mouseout", hoverHandler.bind(1));

//Stick navigation bar to the top after section 1 appears
const navHeight = nav.getBoundingClientRect().height;

const observerNavCallBack = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const observerNavOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const observer = new IntersectionObserver(
  observerNavCallBack,
  observerNavOption
);
observer.observe(header);

//section slide in animation
const sections = document.querySelectorAll(".section");

const revealCallBack = function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    //stop observing, improve the performance
    observer.unobserve(entry.target);
  });
};
const revealObserver = new IntersectionObserver(revealCallBack, {
  root: null,
  threshold: 0.15,
});
sections.forEach(function (section) {
  revealObserver.observe(section);

  section.classList.add("section--hidden");
});

//lazy loading image
const featureImages = document.querySelectorAll(".features__img");
const lazyImgCallBack = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //load the image slowly, or the blur effect gone too fast to see the animation
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  entry.target.src = entry.target.dataset.src;
  observer.unobserve(entry.target);
};
const lazyImgObserver = new IntersectionObserver(lazyImgCallBack, {
  root: null,
  threshold: 0.5,
});
featureImages.forEach(function (lazyImg) {
  lazyImgObserver.observe(lazyImg);
});

//Slider Component Slide
const slider = function () {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");
  const dotContainer = document.querySelector(".dots");
  //next slide
  const slidesLength = slides.length;

  //functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const changeSlide = function (currentSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${i - currentSlide}00%)`;
    });
  };
  const dotsActive = function (currentSlide) {
    document.querySelectorAll(".dots__dot").forEach((d) => {
      d.classList.remove("dots__dot--active");
    });
    document
      .querySelector(`.dots__dot[data-slide="${currentSlide}"]`)
      .classList.add("dots__dot--active");
  };
  const nextSlide = function () {
    currentSlide++;
    if (currentSlide > slidesLength - 1) currentSlide = 0;
    changeSlide(currentSlide);
    dotsActive(currentSlide);
  };
  const previousSlide = function () {
    currentSlide--;
    if (currentSlide < 0) currentSlide = 2;
    changeSlide(currentSlide);
    dotsActive(currentSlide);
  };
  const initialSetUp = function () {
    createDots();
    changeSlide(0);
    dotsActive(0);
  };
  initialSetUp();

  //event listeners
  document
    .querySelector(".slider__btn--right")
    .addEventListener("click", nextSlide);

  document
    .querySelector(".slider__btn--left")
    .addEventListener("click", previousSlide);

  //add key event
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") previousSlide();
    e.key === "ArrowRight" && nextSlide(); //short curcuiting
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const dotSlide = e.target.dataset.slide;
      changeSlide(dotSlide);
      dotsActive(dotSlide);
    }
  });
};
slider();
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// const message = document.createElement("div");

// message.innerHTML =
//   "this is a button<button class='btn btn--close-cookie'>Click</button>";

// const header = document.querySelector(".header");

// // header.append(message);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + "px";

//   // document.documentElement.style.setProperty('property','desired-value');

// const h1 = document.querySelector("h1");

// const alertH1 = function (e) {
//   alert("entered");
//   h1.removeEventListener("mouseenter", alertH1);
// };

// h1.addEventListener("mouseenter", alertH1);

//event capture phase and bubbling phase propagation
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target);
// });
// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   console.log(`LINKs`);
//   this.style.backgroundColor = randomColor();
//   console.log(e.target);
// });

// document.querySelector(".nav").addEventListener("click", function (e) {
//   console.log(`NAV`);
//   console.log(e.target);
// });
//#section--1
