import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PokemonSelection from "./components/PokemonSelection";
import Battle from "./components/BattlePage";

export default function App() {
  return (
    <Router>
      <nav className="bg-gray-800">
        <div className="relative flex items-center justify-center h-20">
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
