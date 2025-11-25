import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/CharacterMatch.css";
import { shuffleArray } from "../../utils/shuffle.js";
import kanaSets from "../../assets/hiragana-katakana.json";

const dakutenCharacters = [
  {
    id: "all-special",
    label: "All Kana",
    jsonKeys: ["special"],
  },
  {
    id: "all-hiragana",
    label: "All Hiragana",
    jsonKeys: ["special"],
  },
  {
    id: "all-katakana",
    label: "All Katakana",
    jsonKeys: ["special"],
  },
  {
    id: "ga",
    label: { hiragana: "が", katakana: "ガ" },
    jsonKeys: ["ga"],
  },
  {
    id: "da",
    label: { hiragana: "だ", katakana: "ダ" },
    jsonKeys: ["da"],
  },
  {
    id: "za",
    label: { hiragana: "ざ", katakana: "ザ" },
    jsonKeys: ["za"],
  },
  {
    id: "ba",
    label: { hiragana: "ば", katakana: "バ" },
    jsonKeys: ["ba"],
  },
  {
    id: "pa",
    label: { hiragana: "ぱ", katakana: "パ" },
    jsonKeys: ["pa"],
  },
];

const specialIds = ["all-special", "all-hiragana", "all-katakana"];
// Base character rows (ga, da, za, ba, pa)
const rowOptions = dakutenCharacters.filter((c) => !specialIds.includes(c.id));
// Script-specific IDs: ga-hiragana, ga-katakana, etc.
const allCharIds = rowOptions.flatMap((item) => [
  `${item.id}-hiragana`,
  `${item.id}-katakana`,
]);

const hiraganaIds = rowOptions.map((item) => `${item.id}-hiragana`);
const katakanaIds = rowOptions.map((item) => `${item.id}-katakana`);

export default function DakutenMatchGame() {
  const navigate = useNavigate();
  const [selectIds, setSelectIds] = useState([]);

  function toggleOption(id) {
    //if all kana is checked then check all boxes
    if (id === "all-special") {
      setSelectIds((prev) =>
        prev.includes("all-special") ? [] : ["all-special", ...allCharIds]
      );
      return;
    }

    if (id === "all-hiragana") {
      setSelectIds((prev) =>
        prev.includes("all-hiragana") ? [] : ["all-hiragana", ...hiraganaIds]
      );
      return;
    }

    if (id === "all-katakana") {
      setSelectIds((prev) =>
        prev.includes("all-katakana") ? [] : ["all-katakana", ...katakanaIds]
      );
      return;
    }
    // Individual script toggle (e.g. "ga-hiragana" or "ga-katakana")
    setSelectIds((prev) => {
      const withoutMasterToggles = prev.filter((v) => !specialIds.includes(v));

      if (withoutMasterToggles.includes(id)) {
        return withoutMasterToggles.filter((v) => v !== id);
      }

      return [...withoutMasterToggles, id];
    });
  }

  function handleStartGame() {
    // Require at least one selection
    if (selectIds.length === 0) {
      alert("Please select at least one set.");
      return;
    }

    // Build map of which scripts are selected per base id
    // e.g. "ga-hiragana" → baseId = "ga", script = "hiragana"
    const selectedScriptsByBase = new Map(); // baseId -> { hiragana: bool, katakana: bool }

    for (const id of selectIds) {
      if (specialIds.includes(id)) continue; // skip all-special/all-hiragana/all-katakana

      const [baseId, script] = id.split("-"); // "ga-hiragana" -> ["ga", "hiragana"]
      if (!baseId || !script) continue;

      if (!selectedScriptsByBase.has(baseId)) {
        selectedScriptsByBase.set(baseId, { hiragana: false, katakana: false });
      }

      const entry = selectedScriptsByBase.get(baseId);
      if (script === "hiragana") entry.hiragana = true;
      if (script === "katakana") entry.katakana = true;
    }

    // If no per-character scripts were selected (e.g. user only clicked All Kana)
    // then derive scripts from the master toggles:
    const useAllHiragana = selectIds.includes("all-hiragana");
    const useAllKatakana = selectIds.includes("all-katakana");
    const useAllBoth = selectIds.includes("all-special");

    if (selectedScriptsByBase.size === 0) {
      // Fallback: select all characters based on master toggles
      rowOptions.forEach((opt) => {
        const baseId = opt.id;
        const flags = { hiragana: false, katakana: false };

        if (useAllBoth) {
          flags.hiragana = true;
          flags.katakana = true;
        } else {
          if (useAllHiragana) flags.hiragana = true;
          if (useAllKatakana) flags.katakana = true;
        }

        if (flags.hiragana || flags.katakana) {
          selectedScriptsByBase.set(baseId, flags);
        }
      });
    }

    // If still nothing, bail out
    if (selectedScriptsByBase.size === 0) {
      alert("Please select at least one set.");
      return;
    }

    // Collect JSON keys needed for the *base* ids
    const keysToUse = new Set();

    for (const opt of dakutenCharacters) {
      if (specialIds.includes(opt.id)) continue;
      if (selectedScriptsByBase.has(opt.id)) {
        opt.jsonKeys.forEach((k) => keysToUse.add(k));
      }
    }

    const questionRaw = [];
    keysToUse.forEach((key) => {
      const entries = kanaSets[key];
      if (Array.isArray(entries)) {
        for (const e of entries) {
          // Attach baseId so we know which scripts to use
          questionRaw.push({ ...e, baseId: key });
        }
      }
    });

    if (!questionRaw.length) {
      alert("No characters found for these selections yet.");
      return;
    }

    // Build final questions taking scripts per base into account
    let questions = [];

    for (const entry of questionRaw) {
      const baseId = entry.baseId;
      const flags = selectedScriptsByBase.get(baseId);
      if (!flags) continue;

      if (flags.hiragana && entry.hiragana) {
        questions.push({
          kana: entry.hiragana,
          romaji: entry.romaji,
        });
      }

      if (flags.katakana && entry.katakana) {
        questions.push({
          kana: entry.katakana,
          romaji: entry.romaji,
        });
      }
    }

    if (!questions.length) {
      alert("No questions could be built for these selections.");
      return;
    }

    questions = shuffleArray(questions);

    navigate("/game/main_memory", {
      state: {
        questions,
        title: "Dakuten Memory Game",
      },
    });
  }

  //helper function if a given id is selected
  function isChecked(id) {
    return selectIds.includes(id);
  }

  const allKanaOption = dakutenCharacters.find((c) => c.id === "all-special");
  const allHiraganaOption = dakutenCharacters.find(
    (c) => c.id === "all-hiragana"
  );
  const allKatakanaOption = dakutenCharacters.find(
    (c) => c.id === "all-katakana"
  );

  return (
    <section className="character-game-section">
      <h2>Dakuten Matching Game</h2>

      <div className="character-container-section">
        {/* Top: All Kana */}
        {allKanaOption && (
          <div className="all-kana-row">
            <label className="select-kana">
              <input
                type="checkbox"
                checked={isChecked(allKanaOption.id)}
                onChange={() => toggleOption(allKanaOption.id)}
              />
              <span>{allKanaOption.label}</span>
            </label>
          </div>
        )}

        {/* Grid: Hiragana (left) / Katakana (right) */}
        <div className="kana-grid">
          {/* Left column: Hiragana */}
          <div className="kana-column">
            {allHiraganaOption && (
              <label className="select-kana">
                <input
                  type="checkbox"
                  checked={isChecked(allHiraganaOption.id)}
                  onChange={() => toggleOption(allHiraganaOption.id)}
                />
                <span>{allHiraganaOption.label}</span>
              </label>
            )}

            {rowOptions.map((opt) => (
              <label key={`${opt.id}-hiragana`} className="select-kana">
                <input
                  type="checkbox"
                  checked={isChecked(`${opt.id}-hiragana`)}
                  onChange={() => toggleOption(`${opt.id}-hiragana`)}
                />
                <span>{opt.label.hiragana}</span>
              </label>
            ))}
          </div>

          {/* Right column: Katakana */}
          <div className="kana-column">
            {allKatakanaOption && (
              <label className="select-kana">
                <input
                  type="checkbox"
                  checked={isChecked(allKatakanaOption.id)}
                  onChange={() => toggleOption(allKatakanaOption.id)}
                />
                <span>{allKatakanaOption.label}</span>
              </label>
            )}

            {rowOptions.map((opt) => (
              <label key={`${opt.id}-katakana`} className="select-kana">
                <input
                  type="checkbox"
                  checked={isChecked(`${opt.id}-katakana`)}
                  onChange={() => toggleOption(`${opt.id}-katakana`)}
                />
                <span>{opt.label.katakana}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="btn-modern" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </section>
  );
}
