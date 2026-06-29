import { FaGithub, FaGlobe } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-gray-500 py-10 px-4 md:px-12 border-t border-zinc-900 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left side */}
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-gray-400 mb-2">
            Netflix MERN Clone
          </p>
          <p className="text-xs">
            © {new Date().getFullYear()} Netflix Clone. Built By BYH
          </p>
        </div>

        {/* Right side Links */}
        <div className="flex gap-6 text-sm">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-2"
          >
            <FaGithub size={18} /> GitHub
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors flex items-center gap-2"
          >
            <FaGlobe size={18} /> Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
}
