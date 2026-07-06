import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Scale,
  Menu,
  X,
  Sun,
  Moon,
  Phone,
} from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Lawyers', href: '/lawyers' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return location.pathname === '/' && location.hash === href.slice(1);
    return location.pathname === href;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-secondary-100 dark:bg-secondary-900/95 dark:border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary-600 rounded-xl group-hover:bg-primary-700 transition-colors">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-900 dark:text-white">
              Lex<span className="text-primary-600">Match</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-secondary-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/case/new"
              className="hidden sm:inline-flex btn btn-primary btn-sm"
            >
              Find a Lawyer
            </Link>

            <a
              href="tel:18001234567"
              className="hidden md:flex items-center gap-2 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">1800-123-4567</span>
            </a>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-secondary-200 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-secondary-100 dark:border-secondary-700 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:bg-secondary-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700">
                <Link
                  to="/case/new"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Find a Lawyer
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
