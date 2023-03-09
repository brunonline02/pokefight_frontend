import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Battle() {
  const { id } = useParams();
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [turn, setTurn] = useState(1);
  const [status, setStatus] = useState("");
  const [run, setRun] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  const [playerHp, setPlayerHp] = useState();
  const [playerAttack, setPlayerAttack] = useState(null);
  const [playerDefense, setPlayerDefense] = useState(null);
  const [playerSpeed, setPlayerSpeed] = useState(null);
  const [opponentHp, setOpponentHp] = useState();
  const [items, setItems] = useState([
    { name: "Potion", quantity: 5 },
    { name: "Increase Attack", quantity: 5 },
    { name: "Increase Defense", quantity: 5 },
  ]);

  var hitAudio = new Audio("/hit_audio.mp3");
  var hitAudioOpponent = new Audio("/hit_audio_opponent.mp3");
  var itemAudio = new Audio("/item_audio.mp3");
  var runAudio = new Audio("/run_audio.mp3");

  useEffect(() => {
    axios
      .get(`pokefightbackend-production.up.railway.app/pokemon/${id}`)
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (typingIndex < status.length) {
        setTypingIndex((prevTypingIndex) => prevTypingIndex + 1);
      }
    }, 10);
    return () => clearInterval(intervalId);
  }, [status, typingIndex]);

  const typingStatus = status.substring(0, typingIndex);

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
      function hitAnimation(hit) {
        const elem = document.getElementById("opponent-pokemon");
        elem.classList.add("shake");
        setTimeout(() => elem.classList.remove("shake"), 1000);
      }
      hitAudio.play();
      hitAnimation();
      // Calculate opponent's new HP
      const newOpponentHp = opponentHp - effectiveDamage;
      setOpponentHp(newOpponentHp);
    }

    setTurn(turn + 1);
    setTypingIndex(0);
  };

  useEffect(() => {
    if (playerHp <= 0) {
      setStatus("You lost!");
      setTimeout(() => {
        window.location.replace("/");
      }, 2000);
      return;
    } else if (opponentHp <= 0) {
      setStatus("You won!");
      setTimeout(() => {
        window.location.replace("/");
      }, 2000);
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
          function hitAnimation(hit) {
            const elem = document.getElementById("player-pokemon");
            elem.classList.add("shake");
            setTimeout(() => elem.classList.remove("shake"), 1000);
          }
          hitAudioOpponent.play();
          hitAnimation();
          // Calculate opponent's new HP
          const newPlayerHp = playerHp - opponentEffectiveDamage;
          setPlayerHp(newPlayerHp);
        }
        setTurn(turn + 1);
      }, 4000);
    }
    setTypingIndex(0);
  }, [turn, playerHp, opponentHp]);

  function handleItem(itemName) {
    const itemIndex = items.findIndex((item) => item.name === itemName);
    const selected = items[itemIndex];
    if (selected.quantity === 0) {
      setStatus(`You don't have any ${itemName} left!`);
    } else {
      const newItems = [...items];
      newItems[itemIndex] = { ...selected, quantity: selected.quantity - 1 };
      setItems(newItems);
      if (itemName === "Potion") {
        const newPlayerHp = playerHp + 20;
        setPlayerHp(newPlayerHp);
        setStatus(`You used a potion!`);
      } else if (itemName === "Increase Attack") {
        const newPlayerAttack = playerAttack + 10;
        setPlayerAttack(newPlayerAttack);
        setStatus(`You used an attack boost!`);
      } else if (itemName === "Increase Defense") {
        const newPlayerDefense = playerDefense + 10;
        setPlayerDefense(newPlayerDefense);
        setStatus(`You used a defense boost!`);
      }
      setTurn(turn + 1);
      itemAudio.play();
    }
    setTypingIndex(0);
  }

  const handleRun = () => {
    const opponentSpeed = opponentPokemon.stats.find(
      (stat) => stat.stat.name === "speed"
    ).base_stat;
    const escapeChance = playerSpeed / opponentSpeed;
    if (Math.random() < escapeChance) {
      setStatus(`You escaped from ${opponentPokemon.name}!`);
      runAudio.play();
      setRun(true);
      setTimeout(() => {
        window.location.replace("/");
      }, 3000);
      return;
    } else {
      setStatus(`You failed to escape from ${opponentPokemon.name}!`);
      setTurn(turn + 1);
    }
    setTypingIndex(0);
  };

  return (
    <div className="flex items-center justify-center">
      {playerPokemon && opponentPokemon ? (
        <div
          className="bg-no-repeat bg-center bg-cover h-[40rem] relative w-[85rem]"
          style={{
            backgroundImage:
              "url(https://i.pinimg.com/736x/89/04/3f/89043fb2d56b3583cce79efe1c3fb53d.jpg)",
          }}
        >
          <audio autoPlay loop>
            <source src="/trainer_battle.m4a" type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
          <div className="relative">
            <div className="absolute top-[150px] left-[250px] w-96">
              <h2 className="relative text-2xl font-bold text-[white]">
                {playerPokemon.name.english}
              </h2>
              <progress
                className="relative progress w-full"
                value={playerHp}
                max={playerPokemon.base.HP}
                color="bg-green-400"
              />

              <p className="relative text-lg font-bold text-[white]">HP</p>

              <img
                id="player-pokemon"
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${playerPokemon.id}.png`}
                alt={playerPokemon.name.english}
                className="relative w-96"
              />
            </div>
            <div className="absolute top-[130px] right-[330px] w-44">
              <h2 className="text-sm relative font-bold text-[white]">
                {opponentPokemon.name}
              </h2>
              <progress
                className="relative progress w-full"
                value={opponentHp}
                max={
                  opponentPokemon.stats.find((stat) => stat.stat.name === "hp")
                    .base_stat
                }
                color="bg-green-400"
              />
              <p className="relative text-sm font-bold text-[white]">HP</p>
              <img
                id="opponent-pokemon"
                src={opponentPokemon.sprites.front_default}
                alt={opponentPokemon.name}
                className="relative w-44"
              />
            </div>
            <div className="absolute top-[430px] right-[200px] bg-[#faf0e6] w-[400px] h-[200px] p-4 rounded-lg border-double border-4 border-[#d9b99b]">
              <div className="h-full flex flex-col">
                <p className="text-base text-gray-700 text-center">
                  Turn: {turn}
                </p>
                <div className="flex h-[200px] items-center">
                  <p className="text-base text-gray-700 typing-effect">
                    {typingStatus}
                  </p>
                </div>
                <div className="h-full flex items-end justify-center">
                  <div>
                    <button
                      className="btn bg-[#eed9c4] hover:bg-[#d9b99b] text-gray-900 px-4 py-2 rounded-md shadow-md transition-all duration-150 mr-4 border-double border-4 border-[#d9b99b] hover:border-gray-500"
                      onClick={() => handleAttack()}
                      disabled={
                        turn % 2 === 0 ||
                        playerHp <= 0 ||
                        opponentHp <= 0 ||
                        run === true
                      }
                    >
                      Attack
                    </button>
                    <label
                      htmlFor="my-modal"
                      className="btn bg-[#eed9c4] hover:bg-[#d9b99b] text-gray-900 px-4 py-2 rounded-md shadow-md transition-all duration-150 mr-4 cursor-pointer border-double border-4 border-[#d9b99b] hover:border-gray-500"
                      disabled={
                        turn % 2 === 0 ||
                        playerHp <= 0 ||
                        opponentHp <= 0 ||
                        run === true
                      }
                    >
                      Items
                    </label>
                    <button
                      className="btn bg-[#eed9c4] hover:bg-[#d9b99b] text-gray-900 px-4 py-2 rounded-md shadow-md transition-all duration-150 border-double border-4 border-[#d9b99b] hover:border-gray-500"
                      onClick={handleRun}
                      disabled={
                        turn % 2 === 0 ||
                        playerHp <= 0 ||
                        opponentHp <= 0 ||
                        run === true
                      }
                    >
                      Run
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input type="checkbox" id="my-modal" className="modal-toggle" />
          <div className="modal">
            <div className="relative modal-box bg-[#faf0e6] border-double border-4 border-[#d9b99b] hover:border-gray-500">
              <label
                htmlFor="my-modal"
                className="btn btn-sm btn-circle absolute right-2 top-2 bg-[#eed9c4] hover:bg-[#d9b99b] text-gray-900 shadow-md transition-all duration-150 border border-1 border-[#d9b99b] hover:border-gray-500"
              >
                ✕
              </label>
              <h2 className="text-lg font-bold mb-4 text-gray-700">
                Select an Item:
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {items.map((item) => (
                  <label
                    htmlFor="my-modal"
                    className="btn bg-[#eed9c4] hover:bg-[#d9b99b] text-gray-900 px-4 py-2 rounded-md shadow-md transition-all duration-150 border-double border-4 border-[#d9b99b] hover:border-gray-500"
                    key={item.name}
                    onClick={() => {
                      handleItem(item.name);
                    }}
                    disabled={item.quantity === 0}
                  >
                    {item.name} ({item.quantity})
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
