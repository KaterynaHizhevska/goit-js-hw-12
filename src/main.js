import './css/styles.css';

import { fetchImages } from './js/pixabay-api.js';
import { renderGallery, showError, showLoader, hideLoader } from './js/render-functions.js';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const form = document.querySelector('.form');
const input = document.querySelector('.input');
const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let query = '';
let totalHits = 0;

const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  query = input.value.trim();
  if (query === '') {
    showError('Please enter a search query');
    return;
  }

  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  showLoader();

  try {
    const data = await fetchImages(query, page);
    hideLoader();
    if (data.hits.length === 0) {
      showError('Sorry, there are no images matching your search query. Please try again!');
    } else {
      renderGallery(data.hits);
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    hideLoader();
    showError('Failed to fetch images. Please try again later.');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();

   try {
    const data = await fetchImages(query, page);
    hideLoader();
    renderGallery(data.hits);

    if (data.hits.length < 15 || page * 15 >= data.totalHits) {
      loadMoreBtn.style.display = 'none';
      showError("We're sorry, but you've reached the end of search results.");
    }

    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    hideLoader();
    showError('Failed to fetch images. Please try again later.');
  }
});