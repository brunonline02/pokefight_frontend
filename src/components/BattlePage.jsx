import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Battle() {
  const { id } = useParams();
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [turn, setTurn] = useState(1);
  const [status, setStatus] = useState(null);

  const [playerHp, setPlayerHp] = useState();
  const [playerAttack, setPlayerAttack] = useState(null);
  const [playerDefense, setPlayerDefense] = useState(null);
  const [playerSpeed, setPlayerSpeed] = useState(null);
  const [opponentHp, setOpponentHp] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/pokemon/${id}`)
      .then((res) => {
        setPlayerPokemon(res.data);
        setPlayerHp(res.data.base.HP);
        setPlayerAttack(res.data.base.Attack);
        setPlayerDefense(res.data.base.Defense);
        setPlayerSpeed(res.data.base.Speed);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
      .then((res) => {
        const randomIndex = Math.floor(Math.random() * res.data.results.length);
        return axios.get(res.data.results[randomIndex].url);
      })
      .then((res) => {
        setOpponentPokemon(res.data);
        setOpponentHp(
          res.data.stats.find((stat) => stat.stat.name === "hp").base_stat
        );
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAttack = () => {
    const damage = Math.floor(
      Math.floor(
        (Math.floor(2 / 5 + 2) * playerAttack * playerSpeed) /
          opponentPokemon.stats.find((stat) => stat.stat.name === "defense")
            .base_stat /
          50
      ) + 2
    );

    // Chance of missing attack
    const hitChance = Math.floor(Math.random() * 100);
    if (hitChance < 25) {
      setStatus(`You missed your attack!`);
    } else {
      // Critical hit chance
      const criticalChance = Math.floor(Math.random() * 100);
      let effectiveDamage;
      if (criticalChance < 25) {
        effectiveDamage = Math.floor(damage * 1.5);
        setStatus(
          `Critical hit! You dealt ${effectiveDamage} damage to ${opponentPokemon.name}!`
        );
      } else {
        effectiveDamage = damage;
        setStatus(
          `You dealt ${effectiveDamage} damage to ${opponentPokemon.name}!`
        );
      }

      // Calculate opponent's new HP
      const newOpponentHp = opponentHp - effectiveDamage;
      setOpponentHp(newOpponentHp);
    }

    setTurn(turn + 1);
  };

  useEffect(() => {
    if (playerHp <= 0) {
      setStatus("You lost!");
      setTimeout(() => {
        window.location.replace("/");
      }, 3000);
      return;
    } else if (opponentHp <= 0) {
      setStatus("You won!");
      setTimeout(() => {
        window.location.replace("/");
      }, 3000);
      return;
    } else if (turn % 2 === 0) {
      setTimeout(() => {
        const opponentDamage = Math.floor(
          Math.floor(
            (Math.floor(2 / 5 + 2) *
              opponentPokemon.stats.find((stat) => stat.stat.name === "attack")
                .base_stat *
              opponentPokemon.stats.find((stat) => stat.stat.name === "speed")
                .base_stat) /
              playerDefense /
              50
          ) + 2
        );

        // Chance of missing attack
        const hitChance = Math.floor(Math.random() * 100);
        if (hitChance < 25) {
          setStatus(`${opponentPokemon.name} missed the attack!`);
        } else {
          // Critical hit chance
          const criticalChance = Math.floor(Math.random() * 100);
          let opponentEffectiveDamage;
          if (criticalChance < 25) {
            opponentEffectiveDamage = Math.floor(opponentDamage * 1.5);
            setStatus(
              `Critical hit! ${opponentPokemon.name} dealt ${opponentEffectiveDamage} damage to you!`
            );
          } else {
            opponentEffectiveDamage = opponentDamage;
            setStatus(
              `${opponentPokemon.name} dealt ${opponentEffectiveDamage} damage to you!`
            );
          }

          // Calculate opponent's new HP
          const newPlayerHp = playerHp - opponentEffectiveDamage;
          setPlayerHp(newPlayerHp);
        }

        setTurn(turn + 1);
      }, 2000);
    }
  }, [turn, playerHp, opponentHp]);

  function handleItem(item) {
    if (item === "potion") {
      setPlayerHp(playerHp + 20);
      setStatus(`You used a potion!`);
    } else if (item === "increase-defense") {
      setPlayerDefense(playerDefense + 5);
      setStatus(`You used a defense boost!`);
    } else if (item === "increase-attack") {
      setPlayerAttack(playerAttack + 5);
      setStatus(`You used an attack boost!`);
    }
    setTurn(turn + 1);
  }

  const handleRun = () => {
    const opponentSpeed = opponentPokemon.stats.find(
      (stat) => stat.stat.name === "speed"
    ).base_stat;
    const escapeChance = playerSpeed / opponentSpeed;
    if (Math.random() < escapeChance) {
      setStatus(`You escaped from ${opponentPokemon.name}!`);
      setTimeout(() => {
        window.location.replace("/");
      }, 1000);
      return;
    } else {
      setStatus(`You failed to escape from ${opponentPokemon.name}!`);
      setTurn(turn + 1);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-gray-200">
      {playerPokemon && opponentPokemon ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-1 text-yellow-300">
              {playerPokemon.name.english}
            </h2>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${playerPokemon.id}.png`}
              alt={playerPokemon.name.english}
              className="mx-auto"
            />
            <p className="text-yellow-300">HP: {playerHp}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-1 text-yellow-300">
              {opponentPokemon.name}
            </h2>
            <img
              src={opponentPokemon.sprites.front_default}
              alt={opponentPokemon.name}
              className="mx-auto"
            />
            <p className="text-yellow-300">HP: {opponentHp}</p>
          </div>
          <div className="col-span-2 bg-gray-800 p-4 rounded-lg">
            <p className="text-yellow-300">Turn: {turn}</p>
            {status && <p>{status}</p>}
            <div className="flex justify-around mt-4">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md shadow-md transition-all duration-150"
                onClick={handleAttack}
              >
                Attack
              </button>
              <div className="dropdown">
                <label
                  tabIndex={0}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md shadow-md transition-all duration-150  cursor-pointer"
                >
                  Items
                </label>
                <ul className="dropdown-content menu p-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-md shadow-md transition-all duration-150 w-36 gap-4">
                  <li className="cursor-pointer">Potion</li>
                  <li className="cursor-pointer">Increase Defense</li>
                  <li className="cursor-pointer">Increase Attack</li>
                </ul>
              </div>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md shadow-md transition-all duration-150"
                onClick={handleRun}
              >
                Run
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
