import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";

export default function PokemonSelection() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    axios
      .get("pokefightbackend-production.up.railway.app/pokemon")
      .then((res) => setPokemonList(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredPokemons = pokemonList.filter((pokemon) => {
    const nameMatch = pokemon.name.english.toLowerCase().includes(searchTerm);
    const typeMatch = pokemon.type.some((type) =>
      type.toLowerCase().includes(searchType)
    );
    return nameMatch || typeMatch;
  });

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setSearchType(value);
    setCurrentPage(0);
  };

  const pageCount = Math.ceil(filteredPokemons.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 mt-4">Choose Your Pokemon:</h1>
      <div className="flex justify-center mb-6 mt-6">
        <input
          type="text"
          placeholder="Search by name or type"
          className="border border-gray-300 rounded-md py-2 px-4 w-80"
          value={searchTerm || searchType}
          onChange={handleSearch}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-4">
        {filteredPokemons
          .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
          .map((pokemon) => (
            <Link
              key={pokemon.id}
              to={`/battle/${pokemon.id}`}
              className="rounded-md overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-150 bg-[#faf0e6] hover:bg-[#eed9c4] border-double border-4 border-[#d9b99b] hover:border-gray-500"
            >
              <div className="h-48 flex items-center justify-center">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name.english}
                  className="h-full"
                />
              </div>
              <div className="py-2 px-4 bg-[#eed9c4] hover:bg-[#d9b99b]">
                <h2 className="text-lg font-bold mb-1 text-gray-500">
                  {pokemon.name.english}
                </h2>
                <p className="text-gray-800 text-sm">HP: {pokemon.base.HP}</p>
                <p className="text-gray-800 text-sm">
                  TYPE: {pokemon.type ? pokemon.type.join(", ") : ""}
                </p>
              </div>
            </Link>
          ))}
      </div>
      <div className="flex justify-center mt-4">
        <ReactPaginate
          previousLabel={"< previous"}
          nextLabel={"next >"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          pageClassName={"page-item"}
          breakClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakLinkClassName={"page-link"}
        />
      </div>
    </div>
  );
}
