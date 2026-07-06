import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CASE_TYPES, COURT_TYPES, INDIAN_STATES, LANGUAGES } from '../types';
import {
  User,
  BadgeCheck,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  X,
  AlertCircle,
  Loader2,
  Scale,
  FileText,
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Personal Info', icon: User },
  { id: 2, name: 'Professional Details', icon: Briefcase },
  { id: 3, name: 'Practice Areas', icon: FileText },
  { id: 4, name: 'Fee & Availability', icon: IndianRupee },
  { id: 5, name: 'Documentation', icon: BadgeCheck },
];

export default function LawyerRegistrationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: user?.full_name || '',
    email: '',
    phone: '',
    lawFirm: '',
    barRegistrationNumber: '',
    officeAddress: '',
    city: '',
    state: '',
    // Step 2: Professional Details
    yearsExperience: '',
    biography: '',
    education: [] as string[],
    currentEducation: '',
    languagesSpoken: [] as string[],
    // Step 3: Practice Areas
    specialization: [] as string[],
    courtsServed: [] as string[],
    // Step 4: Fee & Availability
    consultationFee: '',
    averageCaseFeeMin: '',
    averageCaseFeeMax: '',
    availability: {
      monday: { start: '09:00', end: '18:00', available: true },
      tuesday: { start: '09:00', end: '18:00', available: true },
      wednesday: { start: '09:00', end: '18:00', available: true },
      thursday: { start: '09:00', end: '18:00', available: true },
      friday: { start: '09:00', end: '18:00', available: true },
      saturday: { start: '10:00', end: '14:00', available: false },
    },
    // Step 5: Documentation
    profilePhoto: null as File | null,
    documents: [] as { type: string; file: File }[],
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates });
    setErrors({});
  };

  const toggleArrayItem = (field: 'specialization' | 'courtsServed' | 'languagesSpoken', value: string) => {
    const current = formData[field];
    if (current.includes(value)) {
      updateFormData({ [field]: current.filter((v) => v !== value) });
    } else {
      updateFormData({ [field]: [...current, value] });
    }
  };

  const addEducation = () => {
    if (formData.currentEducation.trim()) {
      updateFormData({
        education: [...formData.education, formData.currentEducation.trim()],
        currentEducation: '',
      });
    }
  };

  const removeEducation = (index: number) => {
    updateFormData({
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const handleDocumentUpload = (type: string, file: File) => {
    updateFormData({
      documents: [...formData.documents, { type, file }],
    });
  };

  const removeDocument = (index: number) => {
    updateFormData({
      documents: formData.documents.filter((_, i) => i !== index),
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.barRegistrationNumber.trim()) newErrors.barRegistrationNumber = 'Bar registration number is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.officeAddress.trim()) newErrors.officeAddress = 'Office address is required';
        break;
      case 2:
        if (!formData.yearsExperience) newErrors.yearsExperience = 'Years of experience is required';
        if (formData.education.length === 0) newErrors.education = 'At least one education entry is required';
        if (formData.languagesSpoken.length === 0) newErrors.languagesSpoken = 'Select at least one language';
        break;
      case 3:
        if (formData.specialization.length === 0) newErrors.specialization = 'Select at least one practice area';
        if (formData.courtsServed.length === 0) newErrors.courtsServed = 'Select at least one court';
        break;
      case 4:
        if (!formData.consultationFee) newErrors.consultationFee = 'Consultation fee is required';
        if (!formData.averageCaseFeeMin || !formData.averageCaseFeeMax) {
          newErrors.averageCaseFee = 'Case fee range is required';
        }
        break;
      case 5:
        if (formData.documents.length < 2) newErrors.documents = 'Please upload at least ID proof and license';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep) || !user) return;

    setIsSubmitting(true);

    try {
      // Update profile role to lawyer
      await supabase
        .from('profiles')
        .update({ role: 'lawyer', full_name: formData.fullName })
        .eq('id', user.id);

      // Create lawyer profile
      const { error } = await supabase.from('lawyers').insert({
        profile_id: user.id,
        bar_registration_number: formData.barRegistrationNumber,
        specialization: formData.specialization,
        years_experience: parseInt(formData.yearsExperience),
        courts_served: formData.courtsServed,
        languages_spoken: formData.languagesSpoken,
        biography: formData.biography,
        education: formData.education,
        office_address: formData.officeAddress,
        consultation_fee: parseInt(formData.consultationFee),
        average_case_fee_min: parseInt(formData.averageCaseFeeMin),
        average_case_fee_max: parseInt(formData.averageCaseFeeMax),
        availability: formData.availability,
        is_verified: false,
        verification_status: 'pending',
      });

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting registration:', err);
      setErrors({ submit: 'Failed to submit registration. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="card p-8">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success-600" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Registration Submitted
            </h1>
            <p className="text-secondary-600 mb-6">
              Your profile is under verification. Our team will review your documents and qualifications.
              You will be notified once your profile is approved.
            </p>
            <div className="flex items-center justify-center gap-2 text-warning-600 bg-warning-50 rounded-lg p-4 mb-6">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Verification typically takes 2-3 business days</span>
            </div>
            <Link to="/dashboard" className="btn btn-primary w-full">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between overflow-x-auto">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center min-w-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentStep > step.id
                    ? 'bg-success-500 text-white'
                    : currentStep === step.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-400'
                }`}
              >
                {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs mt-2 text-center ${currentStep >= step.id ? 'text-secondary-700 font-medium' : 'text-secondary-400'}`}>
                {step.name}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`hidden sm:block w-12 lg:w-20 h-0.5 mx-2 ${currentStep > step.id ? 'bg-success-500' : 'bg-secondary-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 p-2 bg-primary-100 rounded-xl">
            <Scale className="w-6 h-6 text-primary-600" />
            <span className="font-semibold text-primary-700">Lawyer Registration</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">Join LexMatch as a Lawyer</h1>
          <p className="text-secondary-500 mt-2">Complete your profile to start receiving client matches</p>
        </div>

        <div className="card p-6 sm:p-8">
          {renderStepIndicator()}

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Personal Information</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateFormData({ fullName: e.target.value })}
                      className={`input ${errors.fullName ? 'input-error' : ''}`}
                      placeholder="Adv. John Doe"
                    />
                    {errors.fullName && <p className="text-error-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="label">Bar Registration Number *</label>
                    <input
                      type="text"
                      value={formData.barRegistrationNumber}
                      onChange={(e) => updateFormData({ barRegistrationNumber: e.target.value })}
                      className={`input ${errors.barRegistrationNumber ? 'input-error' : ''}`}
                      placeholder="BAR/2010/12345"
                    />
                    {errors.barRegistrationNumber && <p className="text-error-500 text-sm mt-1">{errors.barRegistrationNumber}</p>}
                  </div>

                  <div>
                    <label className="label">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData({ phone: e.target.value })}
                      className={`input ${errors.phone ? 'input-error' : ''}`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-error-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="label">Law Firm / Chamber</label>
                    <input
                      type="text"
                      value={formData.lawFirm}
                      onChange={(e) => updateFormData({ lawFirm: e.target.value })}
                      className="input"
                      placeholder="Doe & Associates"
                    />
                  </div>

                  <div>
                    <label className="label">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateFormData({ state: e.target.value })}
                      className={`select ${errors.state ? 'input-error' : ''}`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-error-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="label">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateFormData({ city: e.target.value })}
                      className={`input ${errors.city ? 'input-error' : ''}`}
                      placeholder="Mumbai"
                    />
                    {errors.city && <p className="text-error-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label">Office Address *</label>
                    <textarea
                      value={formData.officeAddress}
                      onChange={(e) => updateFormData({ officeAddress: e.target.value })}
                      className={`textarea min-h-[80px] ${errors.officeAddress ? 'input-error' : ''}`}
                      placeholder="Full office address with landmark"
                    />
                    {errors.officeAddress && <p className="text-error-500 text-sm mt-1">{errors.officeAddress}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Professional Details</h2>

                <div>
                  <label className="label">Years of Experience *</label>
                  <select
                    value={formData.yearsExperience}
                    onChange={(e) => updateFormData({ yearsExperience: e.target.value })}
                    className={`select ${errors.yearsExperience ? 'input-error' : ''}`}
                  >
                    <option value="">Select Experience</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((y) => (
                      <option key={y} value={y}>{y}+ years</option>
                    ))}
                  </select>
                  {errors.yearsExperience && <p className="text-error-500 text-sm mt-1">{errors.yearsExperience}</p>}
                </div>

                <div>
                  <label className="label">Education *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.currentEducation}
                      onChange={(e) => updateFormData({ currentEducation: e.target.value })}
                      className="input flex-1"
                      placeholder="e.g., LLB, Delhi University (2010)"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())}
                    />
                    <button type="button" onClick={addEducation} className="btn btn-primary">Add</button>
                  </div>
                  {formData.education.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {formData.education.map((edu, i) => (
                        <li key={i} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                          <span className="text-secondary-(text-700">{edu}</span>
                          <button type="button" onClick={() => removeEducation(i)} className="text-error-500 hover:text-error-600">
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors.education && <p className="text-error-500 text-sm mt-1">{errors.education}</p>}
                </div>

                <div>
                  <label className="label">Languages Spoken *</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleArrayItem('languagesSpoken', lang)}
                        className={`badge transition-colors ${
                          formData.languagesSpoken.includes(lang)
                            ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300'
                            : 'bg-secondary-100 text-secondary-600'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  {errors.languagesSpoken && <p className="text-error-500 text-sm mt-1">{errors.languagesSpoken}</p>}
                </div>

                <div>
                  <label className="label">Professional Biography</label>
                  <textarea
                    value={formData.biography}
                    onChange={(e) => updateFormData({ biography: e.target.value })}
                    className="textarea"
                    placeholder="Describe your legal experience, notable cases, and approach to clients..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Practice Areas */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Practice Areas</h2>

                <div>
                  <label className="label">Areas of Specialization *</label>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {CASE_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleArrayItem('specialization', type)}
                        className={`p-3 rounded-xl border-2 text-left transition-colors ${
                          formData.specialization.includes(type)
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-secondary-200 hover:border-primary-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.specialization && <p className="text-error-500 text-sm mt-1">{errors.specialization}</p>}
                </div>

                <div>
                  <label className="label">Courts You Practice In *</label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {COURT_TYPES.map((court) => (
                      <button
                        key={court}
                        type="button"
                        onClick={() => toggleArrayItem('courtsServed', court)}
                        className={`p-3 rounded-xl border-2 text-left transition-colors ${
                          formData.courtsServed.includes(court)
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-secondary-200 hover:border-primary-300'
                        }`}
                      >
                        {court}
                      </button>
                    ))}
                  </div>
                  {errors.courtsServed && <p className="text-error-500 text-sm mt-1">{errors.courtsServed}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Fee & Availability */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Fee Structure & Availability</h2>

                <div>
                  <label className="label">Consultation Fee (&#8377;) *</label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => updateFormData({ consultationFee: e.target.value })}
                    className={`input ${errors.consultationFee ? 'input-error' : ''}`}
                    placeholder="2000"
                  />
                  {errors.consultationFee && <p className="text-error-500 text-sm mt-1">{errors.consultationFee}</p>}
                </div>

                <div>
                  <label className="label">Average Case Fee Range (&#8377;) *</label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={formData.averageCaseFeeMin}
                      onChange={(e) => updateFormData({ averageCaseFeeMin: e.target.value })}
                      className={`input ${errors.averageCaseFee ? 'input-error' : ''}`}
                      placeholder="Minimum: 50000"
                    />
                    <input
                      type="number"
                      value={formData.averageCaseFeeMax}
                      onChange={(e) => updateFormData({ averageCaseFeeMax: e.target.value })}
                      className={`input ${errors.averageCaseFee ? 'input-error' : ''}`}
                      placeholder="Maximum: 150000"
                    />
                  </div>
                  {errors.averageCaseFee && <p className="text-error-500 text-sm mt-1">{errors.averageCaseFee}</p>}
                </div>

                <div>
                  <label className="label">Weekly Availability</label>
                  <div className="space-y-2">
                    {Object.entries(formData.availability).map(([day, times]) => (
                      <div key={day} className="flex items-center gap-4 p-3 bg-secondary-50 rounded-lg">
                        <label className="flex items-center gap-2 min-w-[100px]">
                          <input
                            type="checkbox"
                            checked={times.available}
                            onChange={(e) => updateFormData({
                              availability: { ...formData.availability, [day]: { ...times, available: e.target.checked } }
                            })}
                            className="checkbox"
                          />
                          <span className="capitalize font-medium text-secondary-700">{day}</span>
                        </label>
                        {times.available && (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="time"
                              value={times.start}
                              onChange={(e) => updateFormData({
                                availability: { ...formData.availability, [day]: { ...times, start: e.target.value } }
                              })}
                              className="input text-sm py-2"
                            />
                            <span className="text-secondary-400">to</span>
                            <input
                              type="time"
                              value={times.end}
                              onChange={(e) => updateFormData({
                                availability: { ...formData.availability, [day]: { ...times, end: e.target.value } }
                              })}
                              className="input text-sm py-2"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Documentation */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Verification Documents</h2>

                <p className="text-secondary-500 text-sm mb-4">
                  Upload the following documents for verification. All documents must be clear and legible.
                </p>

                {/* Profile Photo */}
                <div>
                  <label className="label">Profile Photo</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && updateFormData({ profilePhoto: e.target.files[0] })}
                    className="input"
                  />
                </div>

                {/* Required Documents */}
                {[
                  { id: 'gov_id', label: 'Government ID (Aadhaar/PAN)', desc: 'Valid photo ID proof' },
                  { id: 'license', label: 'Bar License Certificate', desc: 'Current practicing certificate' },
                  { id: 'degree', label: 'Law Degree Certificate', desc: 'LLB or equivalent' },
                  { id: 'other', label: 'Other Certifications (Optional)', desc: 'Additional qualifications' },
                ].map((doc) => {
                  const existing = formData.documents.find((d) => d.type === doc.id);
                  return (
                    <div key={doc.id} className="p-4 border-2 border-dashed border-secondary-200 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-secondary-900">{doc.label}</p>
                          <p className="text-xs text-secondary-500">{doc.desc}</p>
                        </div>
                        {existing && (
                          <button onClick={() => removeDocument(formData.documents.indexOf(existing))} className="text-error-500">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {existing ? (
                        <div className="flex items-center gap-2 p-2 bg-success-50 text-success-700 rounded-lg text-sm">
                          <Check className="w-4 h-4" />
                          {existing.file.name}
                        </div>
                      ) : (
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => e.target.files?.[0] && handleDocumentUpload(doc.id, e.target.files[0])}
                          className="input text-sm"
                        />
                      )}
                    </div>
                  );
                })}

                {errors.documents && <p className="text-error-500 text-sm">{errors.documents}</p>}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-secondary-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn btn-ghost gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              {currentStep < STEPS.length ? (
                <button type="button" onClick={handleNext} className="btn btn-primary gap-2">
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn btn-primary gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="w-5 h-5" />
                      Submit for Verification
                    </>
                  )}
                </button>
              )}
            </div>

            {errors.submit && (
              <div className="mt-4 flex items-center gap-2 p-4 bg-error-50 text-error-700 rounded-xl">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
