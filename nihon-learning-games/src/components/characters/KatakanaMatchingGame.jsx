import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/CharacterMatch.css";
import { shuffleArray } from "../../utils/shuffle.js";
import kanaSets from "../../assets/hiragana-katakana.json";

const katakanaCharacters = [
  {
    id: "all-main",
    label: "All Kana",
    jsonKeys: ["main"],
  },
  {
    id: "a",
    label: "ア",
    jsonKeys: ["a"],
  },
  {
    id: "ka",
    label: "カ",
    jsonKeys: ["ka"],
  },
  {
    id: "sa",
    label: "サ",
    jsonKeys: ["sa"],
  },
  {
    id: "ta",
    label: "タ",
    jsonKeys: ["ta"],
  },
  {
    id: "ha",
    label: "ハ",
    jsonKeys: ["ha"],
  },
  {
    id: "na",
    label: "ナ",
    jsonKeys: ["na"],
  },
  {
    id: "ma",
    label: "マ",
    jsonKeys: ["ma"],
  },
  {
    id: "ra",
    label: "ラ",
    jsonKeys: ["ra"],
  },
  {
    id: "ya",
    label: "ヤ",
    jsonKeys: ["ya"],
  },
  {
    id: "wa",
    label: "ワ",
    jsonKeys: ["wa"],
  },
];

export default function KatakanaMatchGame() {
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

    for (const opt of katakanaCharacters) {
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

    //build katakana questions
    const questions = shuffleArray(
      questionRaw.map((entry) => ({
        kana: entry.katakana, //what is shown on screen
        romaji: entry.romaji, //what user types
      }))
    );

    navigate("/game/main_memory", {
      state: {
        questions,
        title: "Katakana Memory Game",
      },
    });
  }

  //helper to check if a given id is selected
  function isChecked(id) {
    return selectIds.includes(id);
  }

  const allKanaOption = katakanaCharacters.find((c) => c.id === "all-main");
  const rowOptions = katakanaCharacters.filter((c) => c.id !== "all-main");

  return (
    <section className="character-game-section">
      <h2>Katakana Matching Game</h2>

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

        {/* Individual rows (ア, カ, サ, etc.) */}
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
