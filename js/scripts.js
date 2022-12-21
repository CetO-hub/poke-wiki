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
      console.log(pokemon);
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

    let leftArrow = document.createElement("img");
    leftArrow.classList.add("modal-icons");
    leftArrow.setAttribute("id", "left-arrow");
    leftArrow.setAttribute("src", "./img/icon_arrow_left.svg");
    let rightArrow = document.createElement("img");
    rightArrow.classList.add("modal-icons");
    rightArrow.setAttribute("id", "right-arrow");
    rightArrow.setAttribute("src", "./img/icon_arrow_right.svg");

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
    modalFooter.appendChild(leftArrow);
    modalFooter.appendChild(rightArrow);

    // Add event listeners for the slide arrows in the modal

    addEventListenerArrowClick(leftArrow, pokemon, "left");
    addEventListenerArrowClick(rightArrow, pokemon, "right");
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
      if (pokemon.id === 150) {
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
