let pokemonRepository = (function () {
  let pokemonList = [
    {
      name: "Bulbasaur",
      height: 0.7,
      types: ["grass", "poison"],
    },
    {
      name: "Charmander",
      height: 0.6,
      types: ["fire"],
    },
    {
      name: "Jigglypuff",
      height: 0.5,
      types: ["fairy", "normal"],
    },
  ];

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    let keysEntered = Object.keys(pokemon).toString();

    if (typeof pokemon !== "object") {
      return console.log("parameter needs to be an object");
    } else {
      if (keysEntered !== "name,height,types") {
        return console.log("object keys need to be: name, height, types");
      } else {
        return pokemonList.push(pokemon);
      }
    }
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

  return {
    getAll: getAll,
    add: add,
    find: find,
  };
})();

// Iterate the pokemonList array and display the name and height of each item

pokemonRepository.getAll().forEach(function (item) {
  if (item.height > 0.6) {
    document.write(
      `<p class="pokemon-item">${item.name} (height: ${item.height} m) - Wow, that’s big! </p>`
    );
  } else {
    document.write(
      `<p class="pokemon-item">${item.name} (height: ${item.height} m)</p>`
    );
  }
});
