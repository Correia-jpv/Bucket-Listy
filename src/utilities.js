import "./libs/particles-js/particles.min.js";

export function getRandomElementsFromArray(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get offset of HTML element
export function getElementOffset(element) {
  var de = document.documentElement;
  var box = element.getBoundingClientRect();
  var top = box.top + window.pageYOffset - de.clientTop;
  var left = box.left + window.pageXOffset - de.clientLeft;
  return { top: top, left: left };
}

// Scroll Event
export function onScrollEventHandler() {
  let supportPageOffset = window.pageXOffset !== undefined;
  let isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

  let scrollTop = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;


  let elHeadline = document.querySelector('.headline'),
    elInner = document.querySelector('.inner'),
    elNav = document.querySelector('nav'),
    navHeight = elNav.offsetHeight;

  let headlineHeight = elHeadline.offsetHeight - navHeight,
    navOffset = getElementOffset(elNav)['top'];

  elHeadline.style.opacity = (1 - scrollTop / headlineHeight);

  for (var i = 0; i < elInner.length; i++) {
    elInner[i].style.transform = `translateY(${scrollTop * 0.4})px`;
  }

  if (navOffset > headlineHeight) {
    elNav.classList.add('scrolled');
  } else {
    elNav.classList.remove('scrolled');
  }
}

export function initParticles() {
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 160,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 4,
          "size_min": 0.3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 600
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "bubble"
        },
        "onclick": {
          "enable": true,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 250,
          "size": 0,
          "duration": 2,
          "opacity": 0,
          "speed": 3
        },
        "repulse": {
          "distance": 400,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
}

export function loadBody() {
  document.body.style.visibility = 'visible';
}

export function getURLParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return (param) ? urlParams.get(param) : urlParams;
}