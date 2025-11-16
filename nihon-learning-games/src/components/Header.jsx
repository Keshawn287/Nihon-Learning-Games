import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header-section">
      <div className="container">
        <h1>Japanese Learning Games</h1>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </div>
    </header>
  );
}
