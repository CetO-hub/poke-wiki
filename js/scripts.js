let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  // Show the pokemon list
  function getAll() {
    return pokemonList;
  }

  // Add a pokemon to the pokemon list
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  // Find a pokemon in the pokemon list
  function find(name) {
    let pokemon = pokemonList.filter(function (pokemons) {
      if (pokemons.name === name) {
        return pokemons;
      }
    });
    if (pokemon.length !== 0) {
      return console.log(pokemon);
    } else {
      return console.log("No pokemon found");
    }
  }
  // Add a pokemon to the DOM
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");

    let listItem = document.createElement("li");
    let button = document.createElement("button");

    button.innerText = pokemon.name;
    button.classList.add("button");

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

  let main = document.querySelector("main");

  // Show "Loading" message while getting data from server
  function showLoadingMessage() {
    let heading = document.createElement("h1");

    heading.textContent = "Loading...";
    heading.classList.add("loadingMessage", "visible");
    main.appendChild(heading);
  }
  // Hide loading Message when data has been loaded
  function hideLoadingMessage() {
    main.removeChild(document.querySelector(".loadingMessage"));
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
  let modalContainer = document.querySelector(".modal-container");

  function showModal(pokemon) {
    modalContainer.innerHTML = "";

    let modalElement = document.createElement("div");
    modalElement.classList.add("modal");
    modalContainer.classList.add("is-visible");

    let closeButtonElement = document.createElement("button");
    closeButtonElement.classList.add("modal-close");
    closeButtonElement.textContent = "Close";
    closeButtonElement.addEventListener("click", hideModal);

    let detailWrapperElement = document.createElement("div");
    detailWrapperElement.classList.add("detail-wrapper");

    let descriptionWrapperElement = document.createElement("div");
    descriptionWrapperElement.classList.add("description-wrapper");

    let nameElement = document.createElement("h1");
    nameElement.textContent = pokemon.name;

    let leftArrowSVGElement = document.createElement("img");
    leftArrowSVGElement.src = "./img/icon_arrow_left.svg";
    leftArrowSVGElement.classList.add("modal-icons");

    let rightArrowSVGElement = document.createElement("img");
    rightArrowSVGElement.src = "./img/icon_arrow_right.svg";
    rightArrowSVGElement.classList.add("modal-icons");

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

    modalElement.appendChild(closeButtonElement);
    detailWrapperElement.appendChild(leftArrowSVGElement);
    detailWrapperElement.appendChild(imageElement);
    descriptionWrapperElement.appendChild(nameElement);
    descriptionWrapperElement.appendChild(hightElement);
    descriptionWrapperElement.appendChild(typesElement);
    detailWrapperElement.appendChild(descriptionWrapperElement);
    detailWrapperElement.appendChild(rightArrowSVGElement);
    modalElement.appendChild(detailWrapperElement);
    modalContainer.appendChild(modalElement);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideModal();
      }
    });

    modalContainer.addEventListener("click", (e) => {
      let target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });

    addEventListenerLeftArrowClick(leftArrowSVGElement, pokemon, "left");
    addEventListenerRightArrowClick(rightArrowSVGElement, pokemon, "right");
  }

  function addEventListenerLeftArrowClick(leftArrowSVGElement, pokemon, left) {
    leftArrowSVGElement.addEventListener("click", () => {
      slideModal(pokemon, left);
    });
  }
  function addEventListenerRightArrowClick(
    rightArrowSVGElement,
    pokemon,
    right
  ) {
    rightArrowSVGElement.addEventListener("click", () => {
      slideModal(pokemon, right);
    });
  }

  function slideModal(pokemon, direction) {
    if (direction === "left") {
      if (pokemon.id === 1) {
        return;
      } else {
        let previousPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${
          pokemon.id - 1
        }/`;
        pokemon.detailsUrl = previousPokemonUrl;
        pokemonRepository.showDetails(pokemon);
      }
    } else if (direction === "right") {
      let nextPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${
        pokemon.id + 1
      }/`;
      pokemon.detailsUrl = nextPokemonUrl;
      pokemonRepository.showDetails(pokemon);
    }
  }

  function hideModal() {
    modalContainer.classList.remove("is-visible");
  }

  return {
    showModal: showModal,
    hideModal: hideModal,
  };
})();

// Iterate the pokemonList array and display the name and height of each item

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
