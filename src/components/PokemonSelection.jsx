import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function PokemonSelection() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/pokemon")
      .then((res) => setPokemonList(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredPokemons = pokemonList.filter((pokemon) => {
    return pokemon.name.english
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">Choose Your Pokemon</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border border-gray-300 rounded-md py-2 px-4 w-80"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPokemons.map((pokemon) => (
          <Link
            key={pokemon.id}
            to={`/battle/${pokemon.id}`}
            className="bg-white rounded-md overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-150"
          >
            <div className="h-48 flex items-center justify-center">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt={pokemon.name.english}
                className="h-full"
              />
            </div>
            <div className="bg-gray-200 py-2 px-4">
              <h2 className="text-lg font-bold mb-1">{pokemon.name.english}</h2>
              <p className="text-gray-800 text-sm">
                Base HP: {pokemon.base.HP}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
