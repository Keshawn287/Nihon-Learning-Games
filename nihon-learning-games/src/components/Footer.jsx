import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-section">
      <p>&copy; {new Date().getFullYear()} Japanese Games by Keshawn Thomas</p>
    </footer>
  );
}
