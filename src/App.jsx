import PokemonSelection from "../components/AllPokemon";
import PokemonDetail from "../components/PokemonDetail";
import PokemonInfo from "../components/PokemonInfo";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">All Pokemon</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/pokemon/:id/:info" element={<PokemonInfo />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/" element={<PokemonSelection />} />
        </Routes>
      </div>
    </Router>
  );
}
