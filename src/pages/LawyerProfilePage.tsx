import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyLawyers } from '../lib/dummy-data';
import {
  BadgeCheck,
  Star,
  MapPin,
  Phone,
  Calendar,
  Clock,
  IndianRupee,
  Languages,
  Building2,
  Briefcase,
  MessageSquare,
  Video,
  Bookmark,
  ChevronLeft,
  Share2,
  Gavel,
  Award,
  GraduationCap,
} from 'lucide-react';

export default function LawyerProfilePage() {
  const { lawyerId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);

  // Find lawyer from dummy data
  const lawyer = dummyLawyers.find(l => l.id === lawyerId);

  const avgRating = lawyer?.reviews?.length
    ? (lawyer.reviews.reduce((sum, r) => sum + r.rating, 0) / lawyer.reviews.length).toFixed(1)
    : null;

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950">
        <div className="text-center">
          <Briefcase className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">Lawyer Not Found</h2>
          <Link to="/lawyers" className="btn btn-primary mt-4">Browse Lawyers</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <Link to="/lawyers" className="inline-flex items-center gap-1 text-secondary-500 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to Lawyers
        </Link>

        {/* Header Card */}
        <div className="card dark:bg-secondary-900 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-primary-600 to-accent-500" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 bg-white dark:bg-secondary-800 rounded-2xl border-4 border-white dark:border-secondary-700 shadow-lg flex items-center justify-center text-3xl font-bold text-primary-600">
                {lawyer.profiles.full_name?.charAt(0) || 'L'}
              </div>
              <div className="flex-1 pt-4 sm:pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">{lawyer.profiles.full_name}</h1>
                  {lawyer.is_verified && (
                    <span className="badge badge-primary">
                      <BadgeCheck className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                  {lawyer.specialization?.join(' | ')}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {lawyer.years_experience} years experience
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {lawyer.profiles.city}, {lawyer.profiles.state}
                  </span>
                  {avgRating && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {avgRating} ({lawyer.reviews.length} reviews)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`btn ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button className="btn btn-secondary">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="card dark:bg-secondary-900">
              <div className="flex border-b border-secondary-100 dark:border-secondary-700">
                {['overview', 'reviews', 'experience'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400'
                        : 'text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* About */}
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">About</h3>
                      <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                        {lawyer.biography || 'No biography provided.'}
                      </p>
                    </div>

                    {/* Specializations */}
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Practice Areas</h3>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.specialization?.map((spec) => (
                          <span key={spec} className="badge badge-primary">{spec}</span>
                        ))}
                      </div>
                    </div>

                    {/* Courts Served */}
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Courts Served</h3>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.courts_served?.map((court) => (
                          <span key={court} className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300">
                            <Gavel className="w-3 h-3 inline mr-1" />
                            {court}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.languages_spoken?.map((lang) => (
                          <span key={lang} className="badge badge-accent">
                            <Languages className="w-3 h-3 inline mr-1" />
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white mb-3 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary-600" />
                        Education
                      </h3>
                      <ul className="space-y-2">
                        {lawyer.education?.map((edu, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2" />
                            <span className="text-secondary-600 dark:text-secondary-300">{edu}</span>
                          </li>
                        ))}
                        {(!lawyer.education || lawyer.education.length === 0) && (
                          <li className="text-secondary-500">No education details provided</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {lawyer.reviews?.length > 0 ? (
                      <>
                        <div className="flex items-center gap-4 mb-6 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
                          <div className="text-center px-6">
                            <p className="text-3xl font-bold text-secondary-900 dark:text-white">{avgRating}</p>
                            <div className="flex justify-center mt-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-secondary-200'}`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">{lawyer.reviews.length} reviews</p>
                          </div>
                        </div>
                        {lawyer.reviews.map((review) => (
                          <div key={review.id} className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-secondary-900 dark:text-white">Client Review</p>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-secondary-200'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-secondary-600 dark:text-secondary-300 text-sm">{review.review_text}</p>
                            <p className="text-xs text-secondary-400 mt-2">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-secondary-200 mx-auto mb-3" />
                        <p className="text-secondary-500 dark:text-secondary-400">No reviews yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Professional Background</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="w-4 h-4 text-primary-600" />
                            <span className="text-sm text-secondary-500 dark:text-secondary-400">Success Rate</span>
                          </div>
                          <p className="text-2xl font-bold text-secondary-900 dark:text-white">{lawyer.success_rate}%</p>
                        </div>
                        <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-primary-600" />
                            <span className="text-sm text-secondary-500 dark:text-secondary-400">Years of Practice</span>
                          </div>
                          <p className="text-2xl font-bold text-secondary-900 dark:text-white">{lawyer.years_experience}+</p>
                        </div>
                      </div>
                    </div>

                    {lawyer.bar_registration_number && (
                      <div>
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Bar Registration</h3>
                        <p className="text-secondary-600 dark:text-secondary-300 flex items-center gap-2">
                          <BadgeCheck className="w-4 h-4 text-success-500" />
                          {lawyer.bar_registration_number}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fee Structure */}
            <div className="card dark:bg-secondary-900 p-6">
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Fee Structure</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-secondary-100 dark:border-secondary-700">
                  <span className="text-secondary-600 dark:text-secondary-400">Consultation Fee</span>
                  <span className="font-semibold text-secondary-900 dark:text-white flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {lawyer.consultation_fee?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-secondary-100 dark:border-secondary-700">
                  <span className="text-secondary-600 dark:text-secondary-400">Case Fee (Est.)</span>
                  <span className="font-semibold text-secondary-900 dark:text-white">
                    &#8377;{lawyer.average_case_fee_min?.toLocaleString()} - &#8377;{lawyer.average_case_fee_max?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link to={`/book/${lawyer.id}`} className="btn btn-primary w-full">
                  <Calendar className="w-4 h-4" />
                  Book Consultation
                </Link>
                <button className="btn btn-secondary w-full">
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </button>
                <button className="btn btn-secondary w-full">
                  <Video className="w-4 h-4" />
                  Video Consultation
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="card dark:bg-secondary-900 p-6">
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                {lawyer.profiles.phone && (
                  <div className="flex items-center gap-3 text-secondary-600 dark:text-secondary-300">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span>{lawyer.profiles.phone}</span>
                  </div>
                )}
                {lawyer.office_address && (
                  <div className="flex items-start gap-3 text-secondary-600 dark:text-secondary-300">
                    <Building2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>{lawyer.office_address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="card dark:bg-secondary-900 p-6">
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Availability</h3>
              <div className="flex items-center gap-2 text-success-600">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                <span>Currently accepting new clients</span>
              </div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2">
                Typically responds within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
