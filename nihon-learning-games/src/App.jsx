//import './App.css'
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import HiraganaMatchGame from "./components/characters/HiraganaMatchingGame.jsx";
import KatakanaMatchGame from "./components/characters/KatakanaMatchingGame.jsx";
import DakutenMatchGame from "./components/characters/DakutenMatchingGame.jsx";
import CombinationMatchGame from "./components/characters/CombinationMatchingGame.jsx";
import MainKanaMemoryGame from "./components/characters/MainKanaMemoryGame.jsx";
import NumberQuiz from "./components/numberGames/NumberQuiz.jsx";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="game/hiragana_match" element={<HiraganaMatchGame />} />
        <Route path="game/katakana_match" element={<KatakanaMatchGame />} />
        <Route path="game/dakuten_match" element={<DakutenMatchGame />} />
        <Route
          path="game/combination_match"
          element={<CombinationMatchGame />}
        />
        {/* Shared play screen for character games*/}
        <Route path="game/main_memory" element={<MainKanaMemoryGame />} />
        <Route path="game/numbers_quiz" element={<NumberQuiz />} />
      </Route>
    </Routes>
  );
}

export default App;
