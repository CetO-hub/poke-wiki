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

  return {
    getAll: getAll,
    add: add,
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
