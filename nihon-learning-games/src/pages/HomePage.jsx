import GameCard from "../components/GameCard.jsx";

export default function HomePage() {
  return (
    <section className="home">
      <div className="game-container">
        <h2>Japanese Characters</h2>
        <div className="card-grid">
          <GameCard
            to="game/hiragana_match"
            title="Hiragana Characters"
            level="Beginer"
            description="Guess the hiragana before it escapes your memory!"
          />
          <GameCard
            to="game/katakana_match"
            title="Katakana Characters"
            level="Moderate"
            description="Spot the katakana and commit to memory!"
          />
          <GameCard
            to="game/dakuten_match"
            title="Dakuten Characters"
            level="Moderate"
            description="Can you crack the buzzy dakuten symbols?"
          />
          <GameCard
            to="game/combination_match"
            title="Combination Characters"
            level="Moderate"
            description="Untangle tricky combo kana!"
          />
        </div>
        <h2>Numbers Games</h2>
        <div className="card-grid">
          <GameCard
            to="game/numbers_quiz"
            title="Basic Romaji Numbers Quiz"
            level="Beginer"
            description="Master Romaji in numbers!"
          />
          <GameCard
            to="game/numbers"
            title="Numbers"
            level="Beginer"
            description="Fill in Later"
          />
          <GameCard
            to="game/numbers"
            title="Numbers"
            level="Beginer"
            description="Fill in Later"
          />
          <GameCard
            to="game/numbers"
            title="Numbers"
            level="Beginer"
            description="Fill in Later"
          />
        </div>
      </div>
    </section>
  );
}
