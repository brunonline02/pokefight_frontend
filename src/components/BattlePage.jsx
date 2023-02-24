import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Battle() {
  const { id } = useParams();
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [opponentPokemon, setOpponentPokemon] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/pokemon/${id}`)
      .then((res) => setPlayerPokemon(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon")
      .then((res) => {
        const randomIndex = Math.floor(Math.random() * res.data.results.length);
        return axios.get(res.data.results[randomIndex].url);
      })
      .then((res) => setOpponentPokemon(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      {playerPokemon && opponentPokemon ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-bold mb-1">
              {playerPokemon.name.english}
            </h2>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${playerPokemon.id}.png`}
              alt={playerPokemon.name.english}
            />
            <p>HP: {playerPokemon.base.HP}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-1">{opponentPokemon.name}</h2>
            <img
              src={opponentPokemon.sprites.front_default}
              alt={opponentPokemon.name}
            />
            <p>
              HP:{" "}
              {
                opponentPokemon.stats.find((stat) => stat.stat.name === "hp")
                  .base_stat
              }
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
