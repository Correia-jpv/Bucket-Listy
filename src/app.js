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


}

// Random inspirational quote from an API for the header 
async function createHeaderQuote() {
  let mediaQuery = window.matchMedia("(min-width: 769px)")

  // Only show quote on large screens
  if (mediaQuery.matches) {
    const api_url = "https://still-ridge-96311.herokuapp.com/https://zenquotes.io/api/random";
    let quote = '',
      response, data,
      maxLength = 140;
    // Get a short quote
    while (quote.length == 0 || quote.includes('zenquotes') || quote.length > maxLength) {
      response = await fetch(api_url)
      data = await response.json();

      quote = data[0]['h'];

      (quote.includes('zenquotes') || quote.length > maxLength) ? await utilities.sleep(1000): null;
    }

    // Add quote to header
    const elQuoteContainer = document.querySelector('.inner');
    elQuoteContainer.innerHTML = quote;
  }
}