import 'bootstrap';
import './scss/app.scss';
import * as utilities from './utilities';
import "./home";

// Load all event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
  window.addEventListener('scroll', utilities.onScrollEventHandler, false);
  document.addEventListener('DOMContentLoaded', utilities.loadBody);
  document.addEventListener('DOMContentLoaded', utilities.initParticles);
  createHeaderQuote();


  const user = localStorage.getItem('user'),
    elLogin = document.querySelector('#login');
  elLogin.addEventListener('click', utilities.loginHandler);
  (user) ? elLogin.text = 'Logout': null;

}

// Random inspirational quote from an API for the header 
async function createHeaderQuote() {
  let mediaQuery = window.matchMedia("(min-width: 769px)")

  // Only show quote on large screens
  if (mediaQuery.matches) {
    const quoteApiUrl = "https://still-ridge-96311.herokuapp.com/https://zenquotes.io/api/random";
    let quote = '',
      maxLength = 140,
      condition

    // Get a short quote
    do {
      await fetch(quoteApiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Connection problem');
          }
          return response.json()
        })
        .then(data => {
          quote = data[0]['h']
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });

      condition = (quote.includes('zenquotes') || quote.length > maxLength || quote.length < 1)
      if (condition)
        await utilities.sleep(1000)
    } while (condition)

    // Add quote to header
    const elQuoteContainer = document.querySelector('.inner');
    elQuoteContainer.innerHTML = quote;
  }
}