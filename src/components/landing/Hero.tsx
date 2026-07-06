import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Scale, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden gradient-bg dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/30 dark:bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-100/20 dark:bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Legal Matching
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 dark:text-white mb-6 leading-tight">
              Find the Right Lawyer,{' '}
              <span className="gradient-text">Powered by AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-secondary-600 dark:text-secondary-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Describe your legal issue, set your budget, and let AI recommend verified lawyers who best fit your case.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/case/new" className="btn btn-primary btn-lg gap-2">
                Find a Lawyer
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/lawyer/register" className="btn btn-secondary btn-lg">
                Register as a Lawyer
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                <Shield className="w-5 h-5 text-success-500" />
                <span className="text-sm font-medium">Verified Lawyers</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                <Scale className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium">1000+ Cases Matched</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                <Users className="w-5 h-5 text-accent-500" />
                <span className="text-sm font-medium">500+ Lawyers</span>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative animate-slide-left hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Lawyer cards floating */}
              <div className="absolute top-0 left-10 card dark:bg-secondary-800 p-6 w-56 animate-float shadow-glow" style={{ animationDelay: '0s' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-white">J. Doe</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Criminal Lawyer</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-amber-400">&#9733;</span>
                  ))}
                  <span className="text-sm text-secondary-500 dark:text-secondary-400 ml-1">4.9</span>
                </div>
              </div>

              <div className="absolute top-32 right-0 card dark:bg-secondary-800 p-6 w-56 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                    SK
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-white">S. Kumar</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Family Lawyer</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-amber-400">&#9733;</span>
                  ))}
                  <span className="text-sm text-secondary-500 dark:text-secondary-400 ml-1">4.8</span>
                </div>
              </div>

              {/* AI badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-glow-lg animate-pulse-slow">
                <Sparkles className="w-12 h-12 text-white" />
              </div>

              {/* Match result */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 card dark:bg-secondary-800 p-6 w-64 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2 text-success-600 font-medium mb-2">
                  <Shield className="w-5 h-5" />
                  95% Match Found
                </div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Based on your case requirements and budget preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
