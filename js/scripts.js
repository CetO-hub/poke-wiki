let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

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

  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");

    let listItem = document.createElement("li");
    let button = document.createElement("button");

    button.innerText = pokemon.name;
    button.classList.add("button");

    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
    addEventListenerClick(button, pokemon);
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      modal.showModal();
      console.log(pokemon);
    });
  }

  function addEventListenerClick(button, pokemon) {
    button.addEventListener("click", function () {
      showDetails(pokemon);
    });
  }

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

  function loadDetails(pokemon) {
    showLoadingMessage();
    let url = pokemon.detailsUrl;
    return fetch(url)
      .then(function (response) {
        hideLoadingMessage();
        return response.json();
      })
      .then(function (json) {
        pokemon.imageUrl = json.sprites.front_default;
        pokemon.height = json.height;
        pokemon.types = json.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showLoadingMessage() {
    let main = document.querySelector("main");
    let heading = document.createElement("h1");

    heading.textContent = "Loading...";
    heading.classList.add("loadingMessage", "visible");
    main.appendChild(heading);
  }

  function hideLoadingMessage() {
    let loadingMessage = document.querySelector(".visible");
    loadingMessage.classList.remove("visible");
  }

  return {
    getAll: getAll,
    add: add,
    find: find,
    addListItem: addListItem,
    loadList: loadList,
  };
})();

// Show or hide modal

let modal = (function () {
  let modalContainer = document.querySelector(".modal-container");

  function showModal() {
    modalContainer.innerHTML = "";

    let closeButtonElement = document.createElement("button");

    closeButtonElement.classList.add("modal-close");
    closeButtonElement.textContent = "Close";
    closeButtonElement.addEventListener("click", hideModal);

    let modalElement = document.createElement("div");
    modalElement.classList.add("modal");
    modalContainer.classList.add("is-visible");

    modalElement.appendChild(closeButtonElement);
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
