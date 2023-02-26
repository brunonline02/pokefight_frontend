// import AllPokemon from "./components/AllPokemon";
// import PokemonDetail from "./components/PokemonDetail";
// import PokemonInfo from "./components/PokemonInfo";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PokemonSelection from "./components/PokemonSelection";
import Battle from "./components/BattlePage";
// import "../public/PKMN RBYGSC.ttf";

export default function App() {
  return (
    <Router>
      <nav class="bg-gray-800">
        <div class="relative flex items-center justify-center h-20">
          <a href="/">
            <img
              className="w-[130px] hover:scale-[140%] transition duration-300 ease-in"
              src="/Logo.png"
              alt="logo"
            />
          </a>
        </div>
      </nav>

      <Routes>
        <Route path="/battle/:id" element={<Battle />} />
        <Route path="/" element={<PokemonSelection />} />
      </Routes>
    </Router>
  );
}
