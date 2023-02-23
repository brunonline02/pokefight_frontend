import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function PokemonDetail() {
  const [pokemon, setPokemon] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/pokemon/${id}`)
      .then((res) => setPokemon(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{pokemon.name.english}</h1>
      <p>Type: {pokemon.type.join(", ")}</p>
      <p>Base Stats:</p>
      <ul>
        {Object.entries(pokemon.base).map(([stat, value]) => (
          <li key={stat}>
            {stat}: {value}
          </li>
        ))}
      </ul>
      <p>
        <Link to={`/pokemon/${id}/name`}>Name only</Link> |{" "}
        <Link to={`/pokemon/${id}/type`}>Type only</Link> |{" "}
        <Link to={`/pokemon/${id}/base`}>Base Stats only</Link>
      </p>
    </div>
  );
}

export default PokemonDetail;
