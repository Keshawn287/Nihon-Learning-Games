import { Link } from "react-router-dom";

export default function GameCard({ to, title, level, description }) {
  return (
    <Link to={to} className="game-card">
      <div className="game-card-header">
        <h2>{title}</h2>
        <span className="game-card-level">{level}</span>
      </div>
      <p className="game-card-description">{description}</p>
    </Link>
  );
}
