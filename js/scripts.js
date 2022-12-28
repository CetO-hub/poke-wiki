let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=905";
  let searchPokemon = document.querySelector("#pokemon-search");
  searchPokemon.addEventListener("input", (e) => {
    find(e, searchPokemon.value);
  });

  // Show the pokemon list
  function getAll() {
    return pokemonList;
  }

  // Add a pokemon to the pokemon list
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  // Find a pokemon in the pokemon list
  function find(e, name) {
    e.preventDefault();
    let pokemon = pokemonList.filter(function (pokemons) {
      if (pokemons.name.includes(name.toLowerCase())) {
        return pokemons;
      }
    });
    showSearchResult(pokemon, name);
  }
  // Add a pokemon to the DOM
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");

    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "p-0", "border-0");
    let button = document.createElement("button");

    button.innerText = pokemon.name;
    button.classList.add("button");
    button.classList.add("btn", "btn-primary");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#pokemon-modal");

    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
    addEventListenerButtonClick(button, pokemon);
  }

  // Load details based on the detailsURL in the pokemon list for the respective pokemon
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      modal.showModal(pokemon);
    });
  }

  // Display the results for the input in the search field
  function showSearchResult(pokemons, name) {
    let pokemonSearchWrapper = document.querySelector(
      ".pokemon-search-wrapper"
    );

    pokemonSearchWrapper.innerHTML = "";

    if (pokemons.length !== 0) {
      pokemons.forEach(function (item) {
        // Create span element with the user input from the search field
        let span = document.createElement("span");
        span.innerHTML = name;
        span.classList.add("search-sequence");

        // Construct the respective pokemon with inserted span element
        let index = item.name.indexOf(name);
        let firstPart = item.name.slice(0, index);
        let lastPart = item.name.slice(index + name.length);
        searchItem = firstPart + span.outerHTML + lastPart;

        // Implement the pokemon construct into a button
        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "p-0", "border-0");

        let button = document.createElement("button");
        button.innerHTML = searchItem;
        button.classList.add("btn", "btn-primary", "button");
        button.setAttribute("type", "button");
        button.setAttribute("data-bs-toggle", "modal");
        button.setAttribute("data-bs-target", "#pokemon-modal");

        listItem.appendChild(button);
        pokemonSearchWrapper.appendChild(listItem);
        addEventListenerButtonClick(button, item);
      });

      pokemonSearchWrapper.classList.add("pokemon-search-wrapper--visible");
    } else {
      let pokemonContainerItem = document.createElement("p");
      pokemonContainerItem.textContent = "No pokemon found";
      pokemonSearchWrapper.appendChild(pokemonContainerItem);
      pokemonSearchWrapper.classList.add("pokemon-search-wrapper--visible");
    }

    window.addEventListener("click", () => {
      pokemonSearchWrapper.classList.remove("pokemon-search-wrapper--visible");
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        pokemonSearchWrapper.classList.remove(
          "pokemon-search-wrapper--visible"
        );
      }
    });
  }

  function addEventListenerButtonClick(button, pokemon) {
    button.addEventListener("click", function () {
      showDetails(pokemon);
    });
  }
  // Get the initial data for the pokemon list
  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl)
      .then(function (response) {
        hideLoadingMessage();
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  // Get detailed data for a certain pokemon
  function loadDetails(pokemon) {
    showLoadingMessage();
    let url = pokemon.detailsUrl;
    return fetch(url)
      .then(function (response) {
        hideLoadingMessage();
        return response.json();
      })
      .then(function (json) {
        pokemon.id = json.id;
        pokemon.name = json.name;
        pokemon.imageUrl = json.sprites.front_default;
        pokemon.height = json.height;
        pokemon.types = json.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  let loadingModal = document.querySelector("#loading-modal");

  // Show "Loading" message while getting data from server
  function showLoadingMessage() {
    loadingModal.classList.add("show", "d-block");
  }
  // Hide loading Message when data has been loaded
  function hideLoadingMessage() {
    loadingModal.classList.remove("show", "d-block");
  }

  return {
    getAll: getAll,
    add: add,
    find: find,
    addListItem: addListItem,
    loadList: loadList,
    showDetails: showDetails,
  };
})();

// Show or hide modal

let modal = (function () {
  let modalTitle = document.querySelector("#pokemon-name");
  let modalBody = document.querySelector(".modal-body");
  let modalFooter = document.querySelector(".modal-footer");

  function showModal(pokemon) {
    modalTitle.textContent = "";
    modalBody.innerHTML = "";
    modalFooter.innerHTML = "";

    let leftArrowWrapperElement = document.createElement("div");
    leftArrowWrapperElement.classList.add(
      "d-flex",
      "flex-column",
      "align-items-center",
      "arrow-wrapper"
    );

    let rightArrowWrapperElement = document.createElement("div");
    rightArrowWrapperElement.classList.add(
      "d-flex",
      "flex-column",
      "align-items-center",
      "arrow-wrapper"
    );

    let leftArrowTextElement = document.createElement("p");
    leftArrowTextElement.textContent = "Previous";
    leftArrowTextElement.classList.add("mb-0", "p-0");

    let rightArrowTextElement = document.createElement("p");
    rightArrowTextElement.textContent = "Next";
    rightArrowTextElement.classList.add("mb-0", "p-0", "pe-1");

    let leftArrowElement = document.createElement("img");
    leftArrowElement.classList.add("modal-icons");
    leftArrowElement.setAttribute("id", "left-arrow");
    leftArrowElement.setAttribute("src", "./img/icon_arrow_left.svg");

    let rightArrowElement = document.createElement("img");
    rightArrowElement.classList.add("modal-icons");
    rightArrowElement.setAttribute("id", "right-arrow");
    rightArrowElement.setAttribute("src", "./img/icon_arrow_right.svg");

    modalTitle.textContent = pokemon.name;

    let detailWrapperElement = document.createElement("div");
    detailWrapperElement.classList.add("detail-wrapper");

    let descriptionWrapperElement = document.createElement("div");
    descriptionWrapperElement.classList.add("description-wrapper");

    let imageElement = document.createElement("img");
    imageElement.src = pokemon.imageUrl;
    imageElement.classList.add("pokemon-image");

    let hightElement = document.createElement("p");
    hightElement.textContent = `Height: ${pokemon.height / 10} m`;

    // Iterate over the type array and save the types in the type array
    let type = [];
    pokemon.types.forEach(function (item) {
      type.push(item.type.name);
    });

    let typesElement = document.createElement("p");
    typesElement.textContent = `Types: ${type.join(", ")}`;

    detailWrapperElement.appendChild(imageElement);
    descriptionWrapperElement.appendChild(hightElement);
    descriptionWrapperElement.appendChild(typesElement);
    detailWrapperElement.appendChild(descriptionWrapperElement);
    modalBody.appendChild(detailWrapperElement);
    leftArrowWrapperElement.appendChild(leftArrowElement);
    leftArrowWrapperElement.appendChild(leftArrowTextElement);
    rightArrowWrapperElement.appendChild(rightArrowElement);
    rightArrowWrapperElement.appendChild(rightArrowTextElement);
    modalFooter.appendChild(leftArrowWrapperElement);
    modalFooter.appendChild(rightArrowWrapperElement);

    // Add event listeners for the slide arrows in the modal

    addEventListenerArrowClick(leftArrowWrapperElement, pokemon, "left");
    addEventListenerArrowClick(rightArrowWrapperElement, pokemon, "right");
  }

  function addEventListenerArrowClick(arrow, pokemon, direction) {
    arrow.addEventListener("click", () => {
      slideModal(pokemon, direction);
    });
  }

  // Find current pokemon id and show the next or previous pokemon

  function slideModal(pokemon, direction) {
    let pokemonCopy = JSON.parse(JSON.stringify(pokemon));
    if (direction === "left") {
      if (pokemon.id === 1) {
        return;
      } else {
        let previousPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${
          pokemon.id - 1
        }/`;
        pokemonCopy.detailsUrl = previousPokemonUrl;
        pokemonRepository.showDetails(pokemonCopy);
      }
    } else if (direction === "right") {
      if (pokemon.id === 905) {
        return;
      } else {
        let nextPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${
          pokemon.id + 1
        }/`;
        pokemonCopy.detailsUrl = nextPokemonUrl;
        pokemonRepository.showDetails(pokemonCopy);
      }
    }
  }

  return {
    showModal: showModal,
  };
})();

// Iterate the pokemonList array and display the name and height of each item

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
