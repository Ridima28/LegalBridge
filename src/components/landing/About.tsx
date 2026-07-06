import { Scale, Target, Heart, Lightbulb } from 'lucide-react';

const values = [
  {
    icon: Scale,
    title: 'Justice for All',
    description: 'We believe everyone deserves access to quality legal representation, regardless of background or budget.',
  },
  {
    icon: Target,
    title: 'Accuracy First',
    description: 'Our AI is trained to understand legal nuances and match clients with the most suitable lawyers.',
  },
  {
    icon: Heart,
    title: 'Client-Centric',
    description: 'Every feature we build is designed to make the legal process smoother for both clients and lawyers.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously improve our platform with cutting-edge AI and user feedback.',
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="badge badge-primary mb-4">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-6">
              Democratizing Legal Access with AI
            </h2>
            <p className="text-lg text-secondary-600 mb-6">
              LexMatch AI was founded with a mission to bridge the gap between people seeking legal help and qualified lawyers. We understand that finding the right lawyer can be overwhelming, time-consuming, and often expensive.
            </p>
            <p className="text-lg text-secondary-600 mb-8">
              Our platform leverages advanced artificial intelligence to analyze legal cases, understand client needs, and match them with verified lawyers who have the right expertise, experience, and availability. This ensures that every client finds their ideal legal representation efficiently.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-1">{value.title}</h4>
                    <p className="text-sm text-secondary-500">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Stats */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl overflow-hidden">
              <img
                src="https://images.pexels.com/photo-6077802/pexels-photo-6077802.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Legal professionals"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Stats overlay */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-card-hover">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">1000+</p>
                  <p className="text-sm text-secondary-500">Cases Matched</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">500+</p>
                  <p className="text-sm text-secondary-500">Verified Lawyers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
