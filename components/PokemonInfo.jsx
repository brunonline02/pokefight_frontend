import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function PokemonInfo() {
  const [pokemonInfo, setPokemonInfo] = useState([]);
  const { id, info } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/pokemon/${id}/${info}`)
      .then((res) => setPokemonInfo(res.data))
      .catch((err) => console.error(err));
  }, [id, info]);

  let infoValue;
  if (info === "name") {
    infoValue = pokemonInfo.english;
  } else if (info === "type") {
    infoValue = pokemonInfo ? pokemonInfo.join(", ") : "";
  } else if (info === "base") {
    infoValue = Object.entries(pokemonInfo || {}).map(([stat, value]) => (
      <li key={stat}>
        {stat}: {value}
      </li>
    ));
  }

  return (
    <div>
      <h1>
        {info === "base"
          ? "Base Stats"
          : info.charAt(0).toUpperCase() + info.slice(1)}
      </h1>
      {infoValue ? (
        <div>
          <p>{infoValue}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <p>
        <Link to={`/pokemon/${id}`}>Back to details</Link>
      </p>
    </div>
  );
}

export default PokemonInfo;
