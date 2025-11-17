import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header-section">
      <div className="container">
        <nav className="top-menu-bar">
          <ul className="nav-links">
            <li className="link">
              <Link to="/">Home</Link>
            </li>
            <li className="link">
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <h1 className="hero">Japanese Learning Games</h1>
      </div>
    </header>
  );
}
