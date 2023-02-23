import React, { useState, useEffect } from "react";
import axios from "axios";

function PokemonSelection(props) {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/pokemon")
      .then((res) => setPokemonList(res.data))
      .catch((err) => console.error(err));
  }, []);

  function handleChange(event) {
    setSelectedPokemon(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onSelect(selectedPokemon);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="pokemon">Choose your Pokemon:</label>
      <select
        id="pokemon"
        name="pokemon"
        value={selectedPokemon}
        onChange={handleChange}
      >
        <option value="">--Please choose a Pokemon--</option>
        {pokemonList.map((pokemon) => (
          <option key={pokemon.id} value={pokemon.name.english}>
            {pokemon.name.english}
          </option>
        ))}
      </select>
      <button type="submit" disabled={!selectedPokemon}>
        Fight!
      </button>
    </form>
  );
}

export default PokemonSelection;
