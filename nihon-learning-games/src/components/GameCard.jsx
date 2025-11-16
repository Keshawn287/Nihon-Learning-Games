import { Link } from "react-router-dom";

export default function GameCard({ to, title, description }) {
  return (
    <Link to={to} className="game-card">
      <h2>{title}</h2>
      <p>{description}</p>
    </Link>
  );
}
