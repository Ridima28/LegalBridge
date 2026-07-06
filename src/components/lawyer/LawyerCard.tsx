import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Lawyer, Profile, Review } from '../../types';
import {
  BadgeCheck,
  IndianRupee,
  MapPin,
  Languages,
  Calendar,
  Star,
  Bookmark,
  MessageSquare,
  Video,
  Eye,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface LawyerWithProfile extends Lawyer {
  profiles: Profile;
  reviews: { rating: number }[];
}

interface LawyerCardProps {
  lawyer: LawyerWithProfile;
  recommendationScore?: number;
  recommendationReason?: string;
  estimatedFee?: number;
  caseId?: string;
  compact?: boolean;
}

export default function LawyerCard({
  lawyer,
  recommendationScore,
  recommendationReason,
  estimatedFee,
  caseId,
  compact = false,
}: LawyerCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const avgRating = lawyer.reviews?.length > 0
    ? (lawyer.reviews.reduce((sum, r) => sum + r.rating, 0) / lawyer.reviews.length).toFixed(1)
    : null;

  const handleSaveLawyer = async () => {
    setIsSaving(true);
    try {
      if (isSaved) {
        await supabase
          .from('saved_lawyers')
          .delete()
          .match({ lawyer_id: lawyer.id });
        setIsSaved(false);
      } else {
        await supabase
          .from('saved_lawyers')
          .insert({ lawyer_id: lawyer.id });
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving lawyer:', err);
    }
    setIsSaving(false);
  };

  if (compact) {
    return (
      <Link
        to={`/lawyer/${lawyer.id}`}
        className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300"
      >
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold text-lg">
          {lawyer.profiles.full_name?.charAt(0) || 'L'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-secondary-900 truncate">{lawyer.profiles.full_name}</h3>
          <p className="text-sm text-secondary-500">{lawyer.specialization?.[0]}</p>
          <div className="flex items-center gap-2 mt-1">
            {avgRating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-secondary-600">{avgRating}</span>
              </div>
            )}
            <span className="text-xs text-secondary-400">
              {lawyer.years_experience} yrs exp
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-primary-600 flex items-center gap-1 justify-end">
            <IndianRupee className="w-4 h-4" />
            {lawyer.consultation_fee.toLocaleString()}
          </p>
          <p className="text-xs text-secondary-400">consultation</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="card p-6 hover:shadow-card-hover transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-primary-600 font-bold text-xl flex-shrink-0">
            {lawyer.profiles.full_name?.charAt(0) || 'L'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-secondary-900">
                {lawyer.profiles.full_name}
              </h3>
              {lawyer.is_verified && (
                <BadgeCheck className="w-5 h-5 text-primary-600" />
              )}
            </div>
            <p className="text-secondary-500 text-sm">{lawyer.specialization?.slice(0, 3).join(' | ')}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-secondary-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {lawyer.years_experience} yrs experience
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {lawyer.profiles.city}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendation Score */}
        {recommendationScore && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-success-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">{recommendationScore}% match</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-secondary-50 rounded-xl mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-secondary-900">{avgRating || 'NEW'}</p>
          <p className="text-xs text-secondary-500">Rating</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-secondary-900">{lawyer.success_rate}%</p>
          <p className="text-xs text-secondary-500">Success Rate</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-primary-600">
            <IndianRupee className="w-4 h-4 inline" />
            {lawyer.consultation_fee.toLocaleString()}
          </p>
          <p className="text-xs text-secondary-500">Consultation</p>
        </div>
      </div>

      {/* AI Recommendation Reason */}
      {recommendationReason && (
        <div className="p-4 bg-primary-50 border border-primary-100 rounded-xl mb-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-primary-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-primary-700 mb-1">Why AI Recommended This Lawyer</p>
              <p className="text-sm text-secondary-600">{recommendationReason}</p>
            </div>
          </div>
          {estimatedFee && (
            <p className="text-sm font-medium text-primary-700 mt-2">
              Estimated Case Fee: &#8377;{estimatedFee.toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Additional Info */}
      <div className="flex flex-wrap gap-2 mb-4">
        {lawyer.languages_spoken?.map((lang) => (
          <span key={lang} className="badge badge-accent text-xs">
            <Languages className="w-3 h-3 inline mr-1" />
            {lang}
          </span>
        ))}
        {lawyer.courts_served?.slice(0, 2).map((court) => (
          <span key={court} className="badge badge-primary text-xs">
            {court}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/lawyer/${lawyer.id}`}
          className="btn btn-primary btn-sm flex-1"
        >
          <Eye className="w-4 h-4" />
          View Profile
        </Link>
        {caseId && (
          <Link
            to={`/book/${lawyer.id}?case=${caseId}`}
            className="btn btn-accent btn-sm flex-1"
          >
            <Calendar className="w-4 h-4" />
            Book Consultation
          </Link>
        )}
        <button
          onClick={handleSaveLawyer}
          disabled={isSaving}
          className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <Link
          to={`/compare?lawyer=${lawyer.id}`}
          className="btn btn-secondary btn-sm"
        >
          Compare
        </Link>
      </div>
    </div>
  );
}
