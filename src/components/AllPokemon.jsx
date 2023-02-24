import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AllPokemon() {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/pokemon")
      .then((res) => setPokemonList(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>All Pokemon</h1>
      <ul>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.id}>
            <Link to={`/pokemon/${pokemon.id}`}>{pokemon.name.english}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
