// import AllPokemon from "./components/AllPokemon";
// import PokemonDetail from "./components/PokemonDetail";
import PokemonInfo from "./components/PokemonInfo";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PokemonSelection from "./components/PokemonSelection";
import Battle from "./components/BattlePage";

export default function App() {
  return (
    <Router>
      <div>
        <nav class="bg-gray-800">
          <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div class="relative flex items-center justify-between h-16">
              <div class="flex items-center justify-center sm:items-stretch sm:justify-start">
                <div class="flex-shrink-0">
                  <a href="/" class="text-white font-bold text-xl">
                    HOME
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/battle/:id" element={<Battle />} />
          <Route path="/" element={<PokemonSelection />} />
        </Routes>
      </div>
    </Router>
  );
}
