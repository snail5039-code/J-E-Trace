import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-center">

        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-blue-600"
        >
          JETRACE
        </Link>

      </div>
    </header>
  );
}