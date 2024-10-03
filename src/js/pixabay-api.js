import axios from 'axios';

const API_KEY = '46278003-3664944736e49f9bfa5b8ba34';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1) {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 15,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}