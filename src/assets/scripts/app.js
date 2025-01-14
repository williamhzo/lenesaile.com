import {gsapHighlight} from './components/gsap';

// ------------------- cards redundant click, accessible whole card clickable solution by Heydon Pickering

const cards = [...document.querySelectorAll('.clickable-card')];
cards.forEach(card => {
  card.style.cursor = 'pointer';
  let down,
    up,
    link = card.querySelector('a');
  card.onmousedown = () => (down = +new Date());
  card.onmouseup = () => {
    up = +new Date();
    if (up - down < 200) {
      link.click();
    }
  };
});

// ------------------- gsap marker

gsapHighlight();

// ----- language  --------------------------------

const languageNav = document.querySelector('.language-nav');
const languageNavButton = document.querySelector('.language-nav-button');
const activeLanguageItem = document.querySelector('.lang-active');
activeLanguageItem.setAttribute('aria-selected', true);
activeLanguageItem.ariaCurrent = 'page';
const clickSound = new Audio('/assets/sounds/mouse.wav');

function toggleNavOpen(event) {
  event.preventDefault();
  languageNav.classList.toggle('active');
  const isOpen = languageNavButton.getAttribute('aria-expanded') === 'false';
  languageNavButton.setAttribute('aria-expanded', isOpen);
  clickSound.play();
}
languageNavButton.addEventListener('click', toggleNavOpen);
