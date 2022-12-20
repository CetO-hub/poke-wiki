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
    listItem.classList.add("group-list-item");
    let button = document.createElement("button");
    button.classList.add("btn", "btn-primary");
    button.classList.add("button");
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", `#${pokemon.name}`);

    button.innerText = pokemon.name;

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
  let modal = document.querySelector(".modal");
  let modalTitle = document.querySelector(".modal-title");
  let modalBody = document.querySelector(".modal-body");

  function showModal(pokemon) {
    modal.setAttribute("id", `${pokemon.name}`);
    modalTitle.textContent = "";
    modalBody.innerHTML = "";

    modalTitle.textContent = pokemon.name;

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

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideModal();
      }
    });
  }

  // Add event listeners for the slide arrows in the modal

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

  // Find current pokemon id and show the next or previous pokemon

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
