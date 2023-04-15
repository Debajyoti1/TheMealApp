(() => {
  // Get DOM elements
  const searchInput = document.getElementById('search');
  const mealsContainer = document.getElementById('meals');
  const favButton = document.getElementById('favourites')
  let favIcons = document.querySelectorAll(".fa-heart")

  // Constants for API URL and delay time
  const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  const SEARCH_DELAY = 1000; // milliseconds

  // Variable to hold the timer object for delayed search requests
  let searchTimer;
  let favItemIds = {}
  let favOn = false

  let checkFavourite = (event) => {
    console.log(event.target);
    let idmeal = event.target.getAttribute('idmeal')
    if (idmeal in favItemIds) {
      delete favItemIds[idmeal]
      event.target.style.color = 'blue'
    }
    else {
      console.log(idmeal);
      favItemIds[idmeal] = ''
      event.target.style.color = 'red'
    }
  }

  // Function to display meals on the page
  function displayMeals(meals) {
    mealsContainer.innerHTML = ''; // clear previous search results
    console.log(meals);
    if (meals === null || meals.length === 0) {
      mealsContainer.textContent = 'No results found.';
      return;
    }

    meals.forEach(meal => {
      const card = document.createElement('div');
      card.classList.add('card');
      let url
      let pathName = window.location.pathname
      if (pathName.endsWith('/')) url = window.location.href
      else url = window.location.origin + '/'
      const anchor = document.createElement('a')
      anchor.setAttribute('href', url + 'meal.html?id=' + meal.idMeal)
      anchor.setAttribute('target', '_blank')

      const image = document.createElement('img');
      image.setAttribute('src', meal.strMealThumb);

      const title = document.createElement('h3');
      title.textContent = meal.strMeal;

      const favoriteIcon = document.createElement('i');
      favoriteIcon.classList.add('fa-solid', 'fa-heart')
      favoriteIcon.style.color = (meal.idMeal in favItemIds) ? 'red' : 'blue'
      favoriteIcon.setAttribute("idmeal", meal.idMeal)

      anchor.appendChild(image)
      card.appendChild(anchor)
      // card.appendChild(image);
      card.appendChild(title);
      card.appendChild(favoriteIcon);
      mealsContainer.appendChild(card);
    });
    favIcons = document.querySelectorAll(".fa-heart")
    favIcons.forEach(icon => {
      icon.addEventListener('click', checkFavourite)
    })
  }

  // Function to fetch meals from the API based on search input
  async function fetchMeals(searchInput) {
    try {
      const response = await fetch(API_URL + searchInput);
      const data = await response.json();
      return data.meals;
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  }

  // Function to delay search requests
  function delayedSearch(_event, delay) {
    console.log(delay)
    if (delay == null) delay = SEARCH_DELAY
    console.log(delay)
    clearInterval(searchTimer); // clear previous timer object
    searchTimer = setTimeout(async () => {
      const searchText = searchInput.value;
      const meals = await fetchMeals(searchText);
      displayMeals(meals);
    }, delay);
  }

  // Event listener for search input
  searchInput.addEventListener('input', delayedSearch);



  // Immediately invoked async function to display initial meals on page load
  (async function () {
    const meals = await fetchMeals('');
    displayMeals(meals, 0);
  })();

  async function toggleFavourite() {
    if (favOn) {
      favOn = false;
      searchInput.value = '';
      delayedSearch(0, 0);
      console.log('favoff');
    } else {
      favOn = true;
      const data = [];
      const promises = Object.keys(favItemIds).map(async (id) => {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const result = await response.json();
        data.push(result.meals[0]);
      });
      await Promise.all(promises);
      displayMeals(data, 0);
      console.log('favon');
    }
  }

  favButton.addEventListener('click', toggleFavourite)
})()