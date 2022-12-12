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

for (i = 0; i < pokemonList.length; i++) {
  document.write(
    `<p>${pokemonList[i].name} (height: ${pokemonList[i].height} m)</p>`
  );
}
