import { FileText, Brain, Users, CalendarCheck } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    number: '01',
    title: 'Describe Your Case',
    description: 'Fill out our intelligent form with details about your legal issue, budget, and preferences.',
  },
  {
    icon: Brain,
    number: '02',
    title: 'AI Analyzes Your Requirements',
    description: 'Our AI processes your case details and identifies the best-matching legal expertise.',
  },
  {
    icon: Users,
    number: '03',
    title: 'Compare Recommended Lawyers',
    description: 'Review lawyer profiles, ratings, fees, and AI-generated compatibility scores.',
  },
  {
    icon: CalendarCheck,
    number: '04',
    title: 'Book a Consultation',
    description: 'Schedule consultations online or in-person with your selected lawyer.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge badge-accent mb-4">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
            Find Your Lawyer in 4 Simple Steps
          </h2>
          <p className="text-lg text-secondary-600">
            Our streamlined process makes finding legal help fast and stress-free.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-500 to-accent-500 transform -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step content */}
                <div className="relative bg-white rounded-2xl p-6 lg:p-8 shadow-card border border-secondary-100 hover:shadow-card-hover transition-all duration-300 text-center">
                  {/* Icon */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-500 transition-colors duration-300">
                      <step.icon className="w-10 h-10 text-primary-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-secondary-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
