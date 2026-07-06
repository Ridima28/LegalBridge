import { Link } from 'react-router-dom';
import { Scale, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary-600 rounded-xl">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Lex<span className="text-primary-400">Match</span>
              </span>
            </Link>
            <p className="text-secondary-400 mb-6">
              AI-powered legal platform connecting you with verified lawyers based on your case, budget, and preferences.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-600 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-600 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-600 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-600 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/#how-it-works" className="hover:text-primary-400 transition-colors">How It Works</Link></li>
              <li><Link to="/lawyers" className="hover:text-primary-400 transition-colors">Find Lawyers</Link></li>
              <li><Link to="/lawyer/register" className="hover:text-primary-400 transition-colors">Become a Lawyer</Link></li>
              <li><Link to="/#pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
              <li><Link to="/#about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/faq" className="hover:text-primary-400 transition-colors">FAQs</Link></li>
              <li><Link to="/#contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/cookies" className="hover:text-primary-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>contact@lexmatch.ai</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-1" />
                <span>123 Legal Complex, New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-secondary-500 text-sm">
              {currentYear} LexMatch AI. All rights reserved.
            </p>
            <p className="text-secondary-500 text-sm text-center">
              AI recommendations are for informational purposes only and do not constitute legal advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
