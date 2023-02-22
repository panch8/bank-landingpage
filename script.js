'use strict';

///////////////////////////////////////

/// elements///

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnLearnMore = document.querySelector('.btn--scroll-to');
const nav = document.querySelector('.nav');
const navBtnlinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('.section');
const header = document.querySelector('.header');
const section1 = document.querySelector('#section--1');
const imgs = document.querySelectorAll('.features__img');
const operationsTabs = document.querySelector('.operations__tab-container');

// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/// Header functionality.

btnLearnMore.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

/// page navigation.
//event handler to parent element, catching event on bubbling.
nav.addEventListener('click', function (e) {
  e.preventDefault();
  //guard clause///
  if (
    !e.target.classList.contains('nav__link') ||
    e.target.classList.contains('btn--show-modal')
  )
    return;

  const id = e.target.getAttribute('href');
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
});

//nav hover effect

const handleMouseOverNav = function (e) {
  if (!e.target.classList.contains('nav__link')) return;
  const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
  const logo = e.target.closest('.nav').querySelector('img');
  siblings.forEach(item => {
    if (item.href !== e.target.href) item.style.opacity = this;
  });
  logo.style.opacity = this;
};

////passsing 'this' as argument with the bind method.
nav.addEventListener('mouseover', handleMouseOverNav.bind(0.5));
nav.addEventListener('mouseout', handleMouseOverNav.bind(1));

////////////      Intersection Observer API       ///////////////////
//sticky navigation bar... applied  when treshold 0% of NO intersection

const optStickyNav = {
  root: null, //null defines intersection with viewport
  treshold: 0,
  rootMargin: `-${nav.clientHeight}px`,
};
const stickyNav = function (entries, observerObj) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const navObserver = new IntersectionObserver(stickyNav, optStickyNav);
navObserver.observe(header);

//// section appearence effect.
sections.forEach(section => section.classList.add('section--hidden'));

const optSections = {
  root: null,
  threshold: 0.1,
};

const sectionEffect = function (entries, observerObj) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(sectionEffect, optSections);
sections.forEach(section => sectionObserver.observe(section));

/////// lazy loading imgs /////

const lazyImg = function (entries, observerObj) {
  const [entry] = entries;
  const pic = entry.target;
  //replace img src with the one on dataset
  if (!entry.isIntersecting) return;
  pic.setAttribute('src', pic.dataset.src);
  //when loaded remove lazy-img class and unobserve
  pic.addEventListener('load', () => entry.target.classList.remove('lazy-img'));
  lazyObserver.unobserve(pic);
};
const lazyObserver = new IntersectionObserver(lazyImg, {
  root: null,
  threshold: 0,
});
imgs.forEach(img => lazyObserver.observe(img));

//////// operations Tab content functionality ///

operationsTabs.addEventListener('click', function (e) {
  e.preventDefault();
  const targetBtn = e.target.closest('.btn');
  if (!targetBtn) return;
  const btnSiblings = document.querySelectorAll('.operations__tab');
  const contentSiblings = document.querySelectorAll('.operations__content');

  //removing active classs to all
  btnSiblings.forEach(btn => btn.classList.remove('operations__tab--active'));
  contentSiblings.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  /// adding active class to current btn and content.
  targetBtn.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${targetBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////// slider //////

/////// this funtionality is exportable ////////

/// in orden to export remember having same html structure. check CSS also.

const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotsContainer = document.querySelector('.dots');

let curSlide;
const init = function () {
  goToSlide(0);
  createDots();
  activeDot(0);
};

const createDots = function () {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<span class="dots__dot" data-index="${i}"></span>`
    );
  });
};
const activeDot = function (slide) {
  const dots = dotsContainer.childNodes;
  dots.forEach((dot, i) => {
    dot.classList.remove('dots__dot--active');
    slide === i && dot.classList.add('dots__dot--active');
  });
};

const goToSlide = function (slide) {
  curSlide = slide;
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - curSlide)}%)`;
  });
};
const nextSlide = function () {
  curSlide++;
  curSlide === slides.length && goToSlide(0);
  goToSlide(curSlide);
  activeDot(curSlide);
};
const prevSlide = function () {
  curSlide--;
  curSlide < 0 && goToSlide(slides.length - 1);
  goToSlide(curSlide);
  activeDot(curSlide);
};

init();
//// event listners /////
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
//keyboard arrows
document.addEventListener('keydown', function (e) {
  e.preventDefault();
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});
// pressing dots.
dotsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  activeDot(+e.target.dataset.index);
  goToSlide(+e.target.dataset.index);
});
