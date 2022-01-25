import 'bootstrap';
import './scss/app.scss';
import * as utilities from './utilities';
import "./home";
import sanitizeHtml from 'sanitize-html';

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
  // let mediaQuery = window.matchMedia("(min-width: 769px)")

  // DISABLED - Only show quote on large screens
  // if (mediaQuery.matches) {
    const quoteApiUrl = "https://leksell.io/zen/api/quotes/random";
    let quote = '',
      author = '',
      maxLength = 100,
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
          quote = data['quote']
          author = data['author']
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });

      condition = (quote.length > maxLength || quote.length < 1)
      if (condition)
        await utilities.sleep(1000)
    } while (condition)

    // Add quote to header
    const elQuoteContainer = document.querySelector('.inner'),
    elQuoteFigure = document.createElement('figure'),
    elQuoteFigureBlockquote = document.createElement('blockquote'),
    elQuoteFigureBlockquoteParagraph = document.createElement('p'),
    elQuoteFigureFigcaption = document.createElement('figcaption'),
    elQuoteFigureFigcaptionCite = document.createElement('cite')

    elQuoteContainer.appendChild(elQuoteFigure)
    elQuoteFigure.appendChild(elQuoteFigureBlockquote)
    elQuoteFigure.appendChild(elQuoteFigureFigcaption)
    elQuoteFigureBlockquote.appendChild(elQuoteFigureBlockquoteParagraph)
    elQuoteFigureFigcaption.appendChild(elQuoteFigureFigcaptionCite)

    elQuoteFigureBlockquote.classList.add('blockquote')
    elQuoteFigureBlockquote.classList.add('my-0')
    elQuoteFigureBlockquote.classList.add('mx-2')
    elQuoteFigureBlockquoteParagraph.classList.add('fs-6')
    elQuoteFigureFigcaption.classList.add('blockquote-footer')
    elQuoteFigureFigcaption.classList.add('text-light')
    elQuoteFigureFigcaption.classList.add('m-0')

    elQuoteFigureBlockquoteParagraph.textContent = quote
    elQuoteFigureFigcaptionCite.textContent = author


  // }
}