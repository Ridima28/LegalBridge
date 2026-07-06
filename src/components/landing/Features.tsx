import { Brain, BadgeCheck, IndianRupee, Lock, Building2, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Advanced algorithms analyze your case details to find lawyers with the right expertise and experience.',
    color: 'primary',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Lawyer Profiles',
    description: 'All lawyers are verified with bar registration, credentials, and professional background checks.',
    color: 'success',
  },
  {
    icon: IndianRupee,
    title: 'Budget-Based Recommendations',
    description: 'Find lawyers within your budget range with transparent fee structures and cost estimates.',
    color: 'warning',
  },
  {
    icon: Lock,
    title: 'Secure Document Upload',
    description: 'Upload case documents securely with end-to-end encryption and privacy protection.',
    color: 'error',
  },
  {
    icon: Building2,
    title: 'Court-Specific Search',
    description: 'Find lawyers experienced in specific courts: District, High Court, Supreme Court, and Tribunals.',
    color: 'accent',
  },
  {
    icon: ShieldCheck,
    title: 'End-to-End Privacy',
    description: 'Your case details and personal information are protected with enterprise-grade security.',
    color: 'primary',
  },
];

const colorClasses = {
  primary: {
    bg: 'bg-primary-100',
    icon: 'text-primary-600',
    hover: 'group-hover:bg-primary-600',
    hoverIcon: 'group-hover:text-white',
  },
  success: {
    bg: 'bg-success-100',
    icon: 'text-success-600',
    hover: 'group-hover:bg-success-600',
    hoverIcon: 'group-hover:text-white',
  },
  warning: {
    bg: 'bg-warning-100',
    icon: 'text-warning-600',
    hover: 'group-hover:bg-warning-600',
    hoverIcon: 'group-hover:text-white',
  },
  error: {
    bg: 'bg-error-100',
    icon: 'text-error-600',
    hover: 'group-hover:bg-error-600',
    hoverIcon: 'group-hover:text-white',
  },
  accent: {
    bg: 'bg-accent-100',
    icon: 'text-accent-600',
    hover: 'group-hover:bg-accent-600',
    hoverIcon: 'group-hover:text-white',
  },
};

export default function Features() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge badge-primary mb-4">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
            Everything You Need to Find the Right Lawyer
          </h2>
          <p className="text-lg text-secondary-600">
            Our platform combines AI technology with verified professionals to simplify your legal journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses] || colorClasses.primary;
            return (
              <div
                key={index}
                className="card-hover p-6 lg:p-8 group"
              >
                <div
                  className={`w-14 h-14 ${colors.bg} ${colors.hover} rounded-xl flex items-center justify-center mb-5 transition-colors duration-300`}
                >
                  <feature.icon className={`w-7 h-7 ${colors.icon} ${colors.hoverIcon} transition-colors duration-300`} />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
