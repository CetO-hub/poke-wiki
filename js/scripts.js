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

// Iterate the pokemonList array and display the name and height of each item

pokemonList.forEach(function (item) {
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
