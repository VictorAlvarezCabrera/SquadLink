import { Link } from "react-router-dom";
import "./Navbar.css";
import Logo from "../assets/img/Logo.webp";

export default function Navbar() {
  return (
    <nav className="navbar">
      <img src={Logo} alt="Logo" id="Logo"/>
      <Link className="nav-link" to="/">Inicio</Link>
      <Link className="nav-link" to="/stats">Estadisticas</Link>
      <Link className="nav-link" to="/champions">Campeones</Link>
      <Link className="nav-link nav-link-right" to="/login">Login</Link>
      <Link className="nav-link" to="/register">Register</Link>
      
    </nav>
  );
}