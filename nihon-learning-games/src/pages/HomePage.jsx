import GameCard from "../components/GameCard.jsx";

export default function HomePage() {
  return (
    <section className="home">
      <div className="container">
        <h2>Choose a Game</h2>
        <div className="card-grid">
          <GameCard
            to="game/numbers"
            title="Number Quiz"
            level="Beginer"
            description="Practice Japanese numbers from 1–10."
          />
        </div>
      </div>
    </section>
  );
}
