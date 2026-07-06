import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CASE_TYPES, COURT_TYPES, INDIAN_STATES, LANGUAGES, type CasePreferences } from '../types';
import { dummyCases } from '../lib/dummy-data';
import {
  User,
  FileText,
  Building2,
  IndianRupee,
  Settings2,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Personal Details', icon: User },
  { id: 2, name: 'Case Details', icon: FileText },
  { id: 3, name: 'Court Information', icon: Building2 },
  { id: 4, name: 'Budget', icon: IndianRupee },
  { id: 5, name: 'Preferences', icon: Settings2 },
];

export default function NewCasePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    // Step 2: Case Details
    caseTitle: '',
    caseDescription: '',
    caseType: '',
    documents: [] as File[],
    documentUrls: [] as string[],
    // Step 3: Court Information
    courtType: '',
    courtState: '',
    courtCity: '',
    hearingLocation: '',
    // Step 4: Budget
    budgetMin: 5000,
    budgetMax: 100000,
    budgetType: 'negotiable',
    // Step 5: Preferences
    preferences: {
      female_lawyer_preferred: false,
      senior_advocate: false,
      local_lawyer: false,
      virtual_consultation: false,
      urgent_case: false,
      language_preference: 'English',
      availability: 'flexible',
    } as CasePreferences,
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates });
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        break;
      case 2:
        if (!formData.caseTitle.trim()) newErrors.caseTitle = 'Case title is required';
        if (!formData.caseDescription.trim()) newErrors.caseDescription = 'Case description is required';
        else if (formData.caseDescription.length < 50) newErrors.caseDescription = 'Please provide more details (at least 50 characters)';
        if (!formData.caseType) newErrors.caseType = 'Case type is required';
        break;
      case 3:
        if (!formData.courtType) newErrors.courtType = 'Court type is required';
        if (!formData.courtState) newErrors.courtState = 'State is required';
        if (!formData.courtCity.trim()) newErrors.courtCity = 'City is required';
        break;
      case 4:
        if (formData.budgetMin >= formData.budgetMax) newErrors.budget = 'Maximum budget must be greater than minimum';
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalSize = [...formData.documents, ...files].reduce((acc, file) => acc + file.size, 0);

    if (totalSize > 20 * 1024 * 1024) {
      setErrors({ documents: 'Total file size cannot exceed 20MB' });
      return;
    }

    setFormData({
      ...formData,
      documents: [...formData.documents, ...files],
    });
    setErrors({});
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index),
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Simulate submission - use first dummy case ID for demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to the first dummy case's analysis page for demo
      navigate(`/case/${dummyCases[0].id}/analysis`);
    } catch (err) {
      console.error('Error creating case:', err);
      setErrors({ submit: 'Failed to submit case. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentStep > step.id
                    ? 'bg-success-500 text-white'
                    : currentStep === step.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-400 dark:bg-secondary-700'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-xs mt-2 hidden sm:block ${
                  currentStep >= step.id ? 'text-secondary-700 dark:text-secondary-300 font-medium' : 'text-secondary-400'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`hidden sm:block flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-success-500' : 'bg-secondary-200 dark:bg-secondary-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Personal Details</h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">Tell us about yourself</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="label">Full Name *</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className={`input ${errors.name ? 'input-error' : ''}`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-error-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="label">Email Address *</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`input ${errors.email ? 'input-error' : ''}`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-error-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="label">Phone Number *</label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            className={`input ${errors.phone ? 'input-error' : ''}`}
            placeholder="+91 9876543210"
          />
          {errors.phone && <p className="text-error-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="state" className="label">State *</label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => updateFormData({ state: e.target.value })}
            className={`select ${errors.state ? 'input-error' : ''}`}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <p className="text-error-500 text-sm mt-1">{errors.state}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="city" className="label">City *</label>
          <input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className={`input ${errors.city ? 'input-error' : ''}`}
            placeholder="Mumbai"
          />
          {errors.city && <p className="text-error-500 text-sm mt-1">{errors.city}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Case Details</h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">Describe your legal issue in detail</p>
      </div>

      <div>
        <label htmlFor="caseTitle" className="label">Case Title *</label>
        <input
          id="caseTitle"
          type="text"
          value={formData.caseTitle}
          onChange={(e) => updateFormData({ caseTitle: e.target.value })}
          className={`input ${errors.caseTitle ? 'input-error' : ''}`}
          placeholder="e.g., Property Dispute with Neighbor over Boundary Wall"
        />
        {errors.caseTitle && <p className="text-error-500 text-sm mt-1">{errors.caseTitle}</p>}
      </div>

      <div>
        <label htmlFor="caseType" className="label">Type of Case *</label>
        <select
          id="caseType"
          value={formData.caseType}
          onChange={(e) => updateFormData({ caseType: e.target.value })}
          className={`select ${errors.caseType ? 'input-error' : ''}`}
        >
          <option value="">Select Case Type</option>
          {CASE_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.caseType && <p className="text-error-500 text-sm mt-1">{errors.caseType}</p>}
      </div>

      <div>
        <label htmlFor="caseDescription" className="label">Detailed Case Description *</label>
        <textarea
          id="caseDescription"
          rows={6}
          value={formData.caseDescription}
          onChange={(e) => updateFormData({ caseDescription: e.target.value })}
          className={`textarea ${errors.caseDescription ? 'input-error' : ''}`}
          placeholder="Please describe your case in detail. Include relevant dates, parties involved, and any important facts..."
        />
        <p className="text-xs text-secondary-500 mt-1">{formData.caseDescription.length}/1000 characters (minimum 50)</p>
        {errors.caseDescription && <p className="text-error-500 text-sm mt-1">{errors.caseDescription}</p>}
      </div>

      <div>
        <label className="label">Supporting Documents</label>
        <p className="text-xs text-secondary-500 mb-2">Upload PDF, images, or DOCX files (max 20MB total)</p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-8 border-2 border-dashed border-secondary-200 dark:border-secondary-600 rounded-xl hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center"
        >
          <Upload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
          <p className="text-secondary-600 dark:text-secondary-300 font-medium">Click to upload files</p>
          <p className="text-sm text-secondary-400">or drag and drop</p>
        </button>

        {errors.documents && <p className="text-error-500 text-sm mt-1">{errors.documents}</p>}

        {formData.documents.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.documents.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-white">{file.name}</p>
                    <p className="text-xs text-secondary-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="p-1 text-secondary-400 hover:text-error-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Court Information</h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">Where do you expect your case to be heard?</p>
      </div>

      <div>
        <label htmlFor="courtType" className="label">Court Type *</label>
        <select
          id="courtType"
          value={formData.courtType}
          onChange={(e) => updateFormData({ courtType: e.target.value })}
          className={`select ${errors.courtType ? 'input-error' : ''}`}
        >
          <option value="">Select Court Type</option>
          {COURT_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.courtType && <p className="text-error-500 text-sm mt-1">{errors.courtType}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="courtState" className="label">State *</label>
          <select
            id="courtState"
            value={formData.courtState}
            onChange={(e) => updateFormData({ courtState: e.target.value })}
            className={`select ${errors.courtState ? 'input-error' : ''}`}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.courtState && <p className="text-error-500 text-sm mt-1">{errors.courtState}</p>}
        </div>

        <div>
          <label htmlFor="courtCity" className="label">City *</label>
          <input
            id="courtCity"
            type="text"
            value={formData.courtCity}
            onChange={(e) => updateFormData({ courtCity: e.target.value })}
            className={`input ${errors.courtCity ? 'input-error' : ''}`}
            placeholder="City where court is located"
          />
          {errors.courtCity && <p className="text-error-500 text-sm mt-1">{errors.courtCity}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="hearingLocation" className="label">Preferred Hearing Location</label>
        <input
          id="hearingLocation"
          type="text"
          value={formData.hearingLocation}
          onChange={(e) => updateFormData({ hearingLocation: e.target.value })}
          className="input"
          placeholder="Specific court or location preference (optional)"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Budget</h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">Set your budget range for legal representation</p>
      </div>

      <div className="card dark:bg-secondary-800 bg-secondary-50 p-6">
        <div className="space-y-8">
          <div>
            <label className="label">Budget Range: &#8377;{formData.budgetMin.toLocaleString()} - &#8377;{formData.budgetMax.toLocaleString()}</label>
            <div className="grid sm:grid-cols-2 gap-6 mt-4">
              <div>
                <label htmlFor="budgetMin" className="text-sm text-secondary-600 dark:text-secondary-400">Minimum (&#8377;)</label>
                <input
                  id="budgetMin"
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={formData.budgetMin}
                  onChange={(e) => updateFormData({ budgetMin: parseInt(e.target.value) })}
                  className="mt-2"
                />
                <p className="text-secondary-600 dark:text-secondary-300 font-medium mt-1">&#8377;{formData.budgetMin.toLocaleString()}</p>
              </div>
              <div>
                <label htmlFor="budgetMax" className="text-sm text-secondary-600 dark:text-secondary-400">Maximum (&#8377;)</label>
                <input
                  id="budgetMax"
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={formData.budgetMax}
                  onChange={(e) => updateFormData({ budgetMax: parseInt(e.target.value) })}
                  className="mt-2"
                />
                <p className="text-secondary-600 dark:text-secondary-300 font-medium mt-1">&#8377;{formData.budgetMax.toLocaleString()}</p>
              </div>
            </div>
            {errors.budget && <p className="text-error-500 text-sm mt-2">{errors.budget}</p>}
          </div>

          <div>
            <label className="label">Engagement Type</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { value: 'consultation', label: 'Consultation Only' },
                { value: 'full', label: 'Full Representation' },
                { value: 'negotiable', label: 'Negotiable' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateFormData({ budgetType: option.value })}
                  className={`p-4 rounded-xl border-2 text-center transition-colors ${
                    formData.budgetType === option.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'border-secondary-200 dark:border-secondary-600 hover:border-primary-300'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Additional Preferences</h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">Help us find the perfect match for your case</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {[
          { key: 'female_lawyer_preferred', label: 'Female Lawyer Preferred', desc: 'Request a female legal representative' },
          { key: 'senior_advocate', label: 'Senior Advocate', desc: 'Prioritize lawyers with 10+ years experience' },
          { key: 'local_lawyer', label: 'Local Lawyer', desc: 'Find lawyers in your city/district' },
          { key: 'virtual_consultation', label: 'Virtual Consultation', desc: 'Open to video/phone consultations' },
          { key: 'urgent_case', label: 'Urgent Case', desc: 'Mark this as time-sensitive' },
        ].map((pref) => (
          <label
            key={pref.key}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
              formData.preferences[pref.key as keyof CasePreferences]
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-secondary-200 dark:border-secondary-600 hover:border-primary-300'
            }`}
          >
            <input
              type="checkbox"
              checked={!!formData.preferences[pref.key as keyof CasePreferences]}
              onChange={(e) => updateFormData({
                preferences: { ...formData.preferences, [pref.key]: e.target.checked }
              })}
              className="checkbox mt-0.5"
            />
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">{pref.label}</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">{pref.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="language" className="label">Language Preference</label>
          <select
            id="language"
            value={formData.preferences.language_preference}
            onChange={(e) => updateFormData({
              preferences: { ...formData.preferences, language_preference: e.target.value }
            })}
            className="select"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="availability" className="label">Your Availability</label>
          <select
            id="availability"
            value={formData.preferences.availability}
            onChange={(e) => updateFormData({
              preferences: { ...formData.preferences, availability: e.target.value }
            })}
            className="select"
          >
            <option value="flexible">Flexible</option>
            <option value="weekdays">Weekdays Only</option>
            <option value="weekends">Weekends Only</option>
            <option value="mornings">Mornings</option>
            <option value="evenings">Evenings</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card dark:bg-secondary-900 p-6 sm:p-8">
          {renderStepIndicator()}

          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}

            {errors.submit && (
              <div className="mt-6 flex items-center gap-2 p-4 bg-error-50 text-error-700 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-secondary-100 dark:border-secondary-700">
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
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary gap-2"
                >
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
                      Analyzing...
                    </>
                  ) : (
                    'Analyze My Case'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
