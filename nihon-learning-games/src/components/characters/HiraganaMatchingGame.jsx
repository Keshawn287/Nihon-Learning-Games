import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/CharacterMatch.css";
import { shuffleArray } from "../../utils/shuffle.js";
import kanaSets from "../../assets/hiragana-katakana.json";

const hiraganaCharacters = [
  {
    id: "all-main",
    label: "All Kana",
    jsonKeys: ["main"],
  },
  {
    id: "a",
    label: "あ",
    jsonKeys: ["a"],
  },
  {
    id: "ka",
    label: "か",
    jsonKeys: ["ka"],
  },
  {
    id: "sa",
    label: "さ",
    jsonKeys: ["sa"],
  },
  {
    id: "ta",
    label: "た",
    jsonKeys: ["ta"],
  },
  {
    id: "ha",
    label: "は",
    jsonKeys: ["ha"],
  },
  {
    id: "na",
    label: "な",
    jsonKeys: ["na"],
  },
  {
    id: "ma",
    label: "ま",
    jsonKeys: ["ma"],
  },
  {
    id: "ra",
    label: "ら",
    jsonKeys: ["ra"],
  },
  {
    id: "ya",
    label: "や",
    jsonKeys: ["ya"],
  },
  {
    id: "wa",
    label: "わ",
    jsonKeys: ["wa"],
  },
];

export default function HiraganaMatchGame() {
  const navigate = useNavigate();
  const [selectIds, setSelectIds] = useState(["a"]);

  function toggleOption(id) {
    //if All Kana is checked then check all boxes
    if (id === "all-main") {
      setSelectIds((prev) => (prev.includes("all-main") ? [] : ["all-main"]));
      return;
    }
    setSelectIds((prev) => {
      //if picking other options de-select all-main
      const withoutAllMain = prev.filter((v) => v !== "all-main");

      if (withoutAllMain.includes(id)) {
        return withoutAllMain.filter((v) => v !== id);
      }
      return [...withoutAllMain, id];
    });
  }

  function handleStartGame() {
    //if user trys to select start game button without picking characters to practice
    if (selectIds.length === 0) {
      alert("Please select at least one set.");
      return;
    }

    //Get all JSON keys needed from selectIDs
    const keysToUse = new Set();

    for (const opt of hiraganaCharacters) {
      if (selectIds.includes(opt.id)) {
        opt.jsonKeys.forEach((k) => keysToUse.add(k));
      }
    }

    const questionRaw = [];
    keysToUse.forEach((key) => {
      const entries = kanaSets[key];
      if (Array.isArray(entries)) {
        questionRaw.push(...entries);
      }
    });

    if (!questionRaw.length) {
      alert("No characters found for these selections yet.");
      return;
    }

    //build hiragana questions
    const questions = shuffleArray(
      questionRaw.map((entry) => ({
        kana: entry.hiragana, //what is shown on screen
        romaji: entry.romaji, //what user types
      }))
    );

    navigate("/game/main_memory", {
      state: {
        questions,
        title: "Hiragana Memory Game",
      },
    });
  }

  //helper to check if a given id is selected
  function isChecked(id) {
    return selectIds.includes(id);
  }

  const allKanaOption = hiraganaCharacters.find((c) => c.id === "all-main");
  const rowOptions = hiraganaCharacters.filter((c) => c.id !== "all-main");

  return (
    <section className="character-game-section">
      <h2>Hiragana Matching Game</h2>

      <div className="character-container-section">
        {/* All Kana row */}
        <div>
          <label className="select-kana">
            <input
              type="checkbox"
              checked={isChecked(allKanaOption.id)}
              onChange={() => toggleOption(allKanaOption.id)}
            />
            <span>{allKanaOption.label}</span>
          </label>
        </div>

        {/* Individual rows (あ, か, さ, etc.) */}
        <div>
          {rowOptions.map((opt) => (
            <label key={opt.id} className="select-kana">
              <input
                type="checkbox"
                checked={isChecked(opt.id)}
                onChange={() => toggleOption(opt.id)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>

        <button className="btn-modern" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </section>
  );
}

// <section className="character-game-section">
//   <h2>Hiragana Matching Game</h2>

//   <div className="character-container-section">
//     <div>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>All Kana</span>
//       </label>
//     </div>
//     <div>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>a</span>
//       </label>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>sa</span>
//       </label>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>ka</span>
//       </label>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>ta</span>
//       </label>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>ha</span>
//       </label>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>na</span>
//       </label>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>ma</span>
//       </label>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>ya</span>
//       </label>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>ra</span>
//       </label>
//       <label className="select-kana">
//         <input type="checkbox" /> <span>wa</span>
//       </label>
//     </div>
//     <button className="btn-modern">Start Game</button>
//   </div>
// </section>
