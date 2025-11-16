//import './App.css'
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import NumberQuiz from "./components/numberGames/NumberQuiz.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="game/numbers" element={<NumberQuiz />} />
      </Route>
    </Routes>
  );
}

export default App;
