import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahul Mehta',
    role: 'Client',
    location: 'Mumbai',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'LexMatch AI found me the perfect criminal defense lawyer within my budget. The AI matching was spot-on, and the lawyer they recommended won my case.',
  },
  {
    name: 'Priya Sharma',
    role: 'Client',
    location: 'Delhi',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'As a first-time legal service user, I was nervous. LexMatch made it so easy to understand my options and find a lawyer who specialized in family law.',
  },
  {
    name: 'Adv. Vikram Singh',
    role: 'Lawyer',
    location: 'Jaipur',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Since joining LexMatch, I have connected with clients who truly need my expertise. The AI matching ensures I get relevant cases aligned with my practice areas.',
  },
  {
    name: 'Ananya Patel',
    role: 'Client',
    location: 'Bangalore',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'The detailed lawyer profiles and AI recommendations helped me make an informed decision. I found a property lawyer who resolved my land dispute efficiently.',
  },
  {
    name: 'Adv. Meena Krishnan',
    role: 'Lawyer',
    location: 'Chennai',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'The platform brings qualified clients to me. No more cold calls or unreliable referrals. LexMatch has transformed how I grow my practice.',
  },
  {
    name: 'Karan Kapur',
    role: 'Client',
    location: 'Hyderabad',
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Found an excellent corporate lawyer through LexMatch. The budget-based recommendations saved me hours of research and negotiation.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge badge-success mb-4">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
            Trusted by Clients and Lawyers Alike
          </h2>
          <p className="text-lg text-secondary-600">
            See how LexMatch AI has helped people find the right legal representation.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card p-6 lg:p-8 hover:shadow-card-hover transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-primary-100 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-secondary-600 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-secondary-100">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-secondary-900">{testimonial.name}</p>
                  <p className="text-sm text-secondary-500">
                    {testimonial.role} | {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
