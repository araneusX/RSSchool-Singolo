'use strict'

/*header*/

const navbar = document.getElementById('js-navbar');
let currentNavigationItem = document.getElementById('js-home');
const anchors = document.querySelectorAll('.anchor');
let lastPosition = anchors.length - 1;
let currentPosition = 0;

let isScroll = false;

/* smooth scroll in JS */
const smoothScrollTo = (elem) => {
  const targetPosition = elem.getBoundingClientRect().top;
  const step = targetPosition / 28;
  let i = 1;
  const timer = setInterval(() => {
    if ( i <= 9) {
      let acceleration;
      if (i <= 3) {
        acceleration = i;
      }else if (i <= 7) {
        acceleration = 4;
      }else{
        acceleration = 11 - i;
      }
      window.scrollBy(0, Math.round(step * acceleration));
      i++;
    }else{
      clearInterval(timer);
      elem.scrollIntoView();
    }
  }, 60);
  window.addEventListener('wheel', () => {clearInterval(timer);}, {once:true})
}

const onNavigation = (e) => {
  e.preventDefault();
  isScroll = false;
  if (e.target.parentNode.parentNode === navbar) {
    const targetElement = document.getElementById(e.target.dataset.anchor)
    smoothScrollTo(targetElement); 
  }
}

// navbar.addEventListener('click', onNavigation); // for smooth scroll

/* menu show */

const menuBurger = document.getElementById('js-menu-button');
const header = document.getElementById('js-header');
const logo = document.getElementById('js-logo-img');

const onMenuClick = (e) => {
  if (e.target !== navbar && e.target !== logo && e.target.parentNode !== navbar) {
    document.removeEventListener('click', onMenuClick);
    header.classList.remove('menu-open');
    menuBurger.addEventListener('click', onBurgerClick, {once: true});
    setTimeout(()=> {logo.parentNode.classList.remove('transitioned');}, 500);
  }
}

const onBurgerClick = (e) => {
  e.stopPropagation();
  logo.parentNode.classList.add('transitioned');
  header.classList.add('menu-open');
  document.addEventListener('click', onMenuClick);
}

menuBurger.addEventListener('click', onBurgerClick, {once: true});

/**/

const followCurrentNavigationItem = () => {

  const changeCurrent = (nextPosition) => {
    currentPosition = nextPosition;
    currentNavigationItem.classList.remove('current');
    currentNavigationItem = document.getElementById(anchors[nextPosition].dataset.anchor);
    currentNavigationItem.classList.add('current');
  }

  if (anchors[currentPosition].getBoundingClientRect().top > window.innerHeight/2) {
    changeCurrent(currentPosition - 1);
  }else if (document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight) {
    changeCurrent(lastPosition);
  }else{
    for (let i = 0; i < anchors.length; i++) {
      const elTop = anchors[i].getBoundingClientRect().top;
      if (elTop >= 0 && elTop < window.innerHeight/2) {
        changeCurrent(i);
        return;
      }
    }
  }
}
followCurrentNavigationItem();
window.addEventListener('scroll', followCurrentNavigationItem);

/*slider*/

const slider = (function () {

  const section = document.getElementById('js-slider-section');
  section.addEventListener('mousedown', (e)=>{e.preventDefault()});

  const slides = document.querySelectorAll('.slide');

  const btnNext = document.getElementById('js-slider-next');
  const btnPrevious = document.getElementById('js-slider-previous');

  let action;

  let current  = (function () {
      for (let i=0; i<slides.length; i++) {
        if (slides[i].classList.contains('visible_slide')) {
          return i;
        }
      }
    })();
  
  function prepare () {
    for (let i=0; i<slides.length; i++) {
      slides[i].classList.remove('previous_slide', 'next_slide', 'trash_next', 'trash_previous');
      if (i !== current) {
        slides[i].classList.remove('visible_slide');
      }
    }
  }

  function next () {
    action = false;
    removeBtnListeners();
    setTimeout(addActionListeners, 500);
    
    prepare();
    
    let nextIndex;
    if (current < slides.length - 1) {
      nextIndex = current + 1;
    }else{
      nextIndex = 0;
    }
    
    const currentSlide = slides[current];
    const nextSlide = slides[nextIndex];
    current = nextIndex;
    nextSlide.classList.add('next_slide');
    currentSlide.classList.add('trash_next');
    nextSlide.addEventListener('animationend', () => {
      nextSlide.classList.add('visible_slide');
      removeActionListeners();
      if (action) {
        setTimeout(action);
      }else{
        addBtnListeners();
      }
    }, {once:true});

    section.style.backgroundColor = current % 2 === 0 ? '#ef6c64' : '#648BF0';
  }

  function previous () {

    action = false;
    removeBtnListeners();
    setTimeout(addActionListeners, 500);

    prepare();
    let previousIndex;
    if (current > 0) {
      previousIndex = current - 1;
    }else{
      previousIndex = slides.length - 1;
    }
    
    const currentSlide = slides[current];
    const previousSlide = slides[previousIndex];
    current = previousIndex;
    previousSlide.classList.add('previous_slide');
    currentSlide.classList.add('trash_previous');
    previousSlide.addEventListener('animationend', () => {
      previousSlide.classList.add('visible_slide');
      removeActionListeners();
      if (action) {
        setTimeout(action);
      }else{
        addBtnListeners();
      }
    }, {once:true});

    section.style.backgroundColor = current % 2 === 0 ? '#ef6c64' : '#648BF0';
  }

  function setActionNext () {
    action = next;
  }

  function setActionPrevious () {
    action = previous;
  }
  
  function addActionListeners () {
    btnPrevious.addEventListener('click', setActionPrevious);
    btnNext.addEventListener('click', setActionNext);
  }

  function removeActionListeners () {
    btnPrevious.removeEventListener('click', setActionPrevious);
    btnNext.removeEventListener('click', setActionNext);
  }

  function addBtnListeners () {
    btnNext.addEventListener('click', next);
    btnPrevious.addEventListener('click', previous);
  }

  
  function removeBtnListeners () {
    btnNext.removeEventListener('click', next);
    btnPrevious.removeEventListener('click', previous);
  }

  return {
    next,
    previous,
    start: addBtnListeners
  }
})();

slider.start();

/*screen off*/

const iPhones = document.querySelectorAll('.iPhone');
iPhones.forEach((iPhone) => {
  const screen = iPhone.querySelector('.iPhone__background');
  const touch = iPhone.querySelectorAll('.touch');
  touch.forEach((el) => {
    el.addEventListener('click', () => {screen.classList.toggle('background_no-image')})
  })
})

/*portfolio*/
const filter = document.getElementById('js-filter');
const wall = document.getElementById('js-wall');
let currentCategory = filter.querySelector('li');

filter.addEventListener('click', (e) => {
  if (e.target.parentNode === filter && e.target !== currentCategory) {
    currentCategory.classList.remove('selected');
    currentCategory = e.target;
    currentCategory.classList.add('selected');

    const arrProjects = [...wall.querySelectorAll('li')];
    const movedElement = arrProjects.pop();
    arrProjects.unshift(movedElement);

    for (let i = 0; i < arrProjects.length; i++){
      wall.firstChild.remove();
    }
    for (let i = 0; i < arrProjects.length; i++){
      wall.append(arrProjects[i]);
    }
  }
});

let selectedProject;
wall.addEventListener('click', (e) => {
    if (e.target.parentNode.parentNode === wall) {
    if (selectedProject) {
      selectedProject.classList.remove('selected_project');
    }
    selectedProject = e.target;
    selectedProject.classList.add('selected_project');
  }
})
  
/*form*/
const form = document.getElementById('js-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
});

const name = document.querySelector('.form__name');
const email = document.querySelector('.form__email');
const subject = document.querySelector('.form__subject');
const detail = document.querySelector('.form__detail');
const formSubmit = document.querySelector('.form__submit');

const modalWindow = document.getElementById('js-modal-window');
const modalAlert = document.getElementById('js-alert');
const modalMessage = document.getElementById('js-modal-message');
const modalButton = document.getElementById('js-modal-button');

const validateEmail = () => {
  if (/^.+@.+\..+$/i.test(email.value)) {
    email.classList.remove('invalid');
    return true;
  }else{
    email.classList.add('invalid');
    return false;
  }
}

const validateName = () => {
  if (/^[a-zа-яё\s]{2,}$/i.test(name.value)) {
    name.classList.remove('invalid');
    return true;
  }else{
    name.classList.add('invalid');
    return false;
  }
}

name.addEventListener('input', validateName);
email.addEventListener('input', validateEmail);

formSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!validateEmail() || !validateName()) {
    if (!validateName()) {
       name.focus();
    }else{
      email.focus();
    }
  }else{
    modalWindow.classList.add('visible');
    modalButton.addEventListener('click', () => {
      modalWindow.classList.remove('visible');
      
      modalMessage.innerHTML ='';
      name.value = '';
      email.value = '';
      subject.value = '';
      detail.value = '';      
    }, {once:true});

    const theme = document.createElement('p');
    theme.textContent = subject.value !== '' ? `Тема: ${subject.value}` : 'Без темы';
    modalMessage.append(theme);
    
    const description = document.createElement('p');
    description.textContent = detail.value !== '' ? `Описание: ${detail.value}` : 'Без описания';
    modalMessage.append(description);
  }
});
