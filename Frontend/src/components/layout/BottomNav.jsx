import { NavLink } from "react-router-dom";

const links = [
  ["/dashboard", "⌂", "Learn"],
  ["/practice", "◉", "Practice"],
  ["/upload", "▤", "Notes"],
  ["/progress", "◔", "Progress"]
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {links.map(([to, icon, label]) => (
        <NavLink key={to} to={to} className={({isActive}) => isActive ? "active" : ""}>
          <span>{icon}</span>
          <small>{label}</small>
        </NavLink>
      ))}
    </nav>
  );
}
