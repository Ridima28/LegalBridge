import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dummyCases, getRecommendationsForCase } from '../lib/dummy-data';
import type { Case, CaseLawyerRecommendation, Lawyer, Profile } from '../types';
import LawyerCard from '../components/lawyer/LawyerCard';
import {
  Sparkles,
  FileText,
  Clock,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  ArrowLeft,
  Share2,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function CaseAnalysisPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [recommendations, setRecommendations] = useState<ReturnType<typeof getRecommendationsForCase>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      // Find case from dummy data
      const foundCase = dummyCases.find(c => c.id === caseId);

      if (foundCase) {
        setCaseData(foundCase);

        // Get recommendations based on case type
        if (foundCase.case_type) {
          const recs = getRecommendationsForCase(foundCase.case_type);
          setRecommendations(recs);
        }
      }
      setIsLoading(false);
    }, 2000);
  }, [caseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-primary-100 rounded-full animate-ping" />
            <div className="absolute inset-0 border-4 border-t-primary-500 rounded-full animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Analyzing Your Legal Requirements...
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400">
            Our AI is reviewing your case details and finding the best lawyers
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {['Understanding case type...', 'Estimating complexity...', 'Matching lawyers...'].map((step, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full text-sm text-primary-600 dark:text-primary-400">
                <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">Case Not Found</h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-6">The case you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const analysis = caseData.ai_analysis as {
    summary: string;
    category: string;
    complexity: string;
    suggested_strategy: string;
    estimated_timeline: string;
    estimated_cost_min: number;
    estimated_cost_max: number;
    confidence_score: number;
    key_legal_points?: string[];
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity?.toLowerCase()) {
      case 'low': return 'text-success-600 bg-success-100';
      case 'medium': return 'text-warning-600 bg-warning-100';
      case 'high': return 'text-error-600 bg-error-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-secondary-500 hover:text-primary-600 dark:text-secondary-400 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">AI Case Analysis</h1>
            <p className="text-secondary-500 dark:text-secondary-400 mt-1">{caseData.title}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="btn btn-secondary btn-sm">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - AI Analysis */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Summary Card */}
            <div className="card dark:bg-secondary-900 overflow-hidden">
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="w-full flex items-center justify-between p-5 border-b border-secondary-100 dark:border-secondary-700 bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  <span className="font-semibold">AI Case Summary</span>
                </div>
                {showSummary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showSummary && analysis && (
                <div className="p-5 space-y-4">
                  <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                    {analysis.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1">Category</p>
                      <p className="font-medium text-secondary-900 dark:text-white">{analysis.category}</p>
                    </div>
                    <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1">Complexity</p>
                      <span className={`badge ${getComplexityColor(analysis.complexity)}`}>
                        {analysis.complexity}
                      </span>
                    </div>
                    <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1">Timeline</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-secondary-400" />
                        <p className="font-medium text-secondary-900 dark:text-white text-sm">{analysis.estimated_timeline}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1">Est. Cost</p>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-secondary-400" />
                        <p className="font-medium text-secondary-900 dark:text-white text-sm">
                          {(analysis.estimated_cost_min / 1000).toFixed(0)}K - {(analysis.estimated_cost_max / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-700 dark:text-primary-400">AI Confidence Score</span>
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{analysis.confidence_score}%</span>
                    </div>
                    <div className="h-2 bg-primary-100 dark:bg-primary-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.confidence_score}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legal Strategy */}
            {analysis?.suggested_strategy && (
              <div className="card dark:bg-secondary-900 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-warning-500" />
                  <h3 className="font-semibold text-secondary-900 dark:text-white">Suggested Legal Strategy</h3>
                </div>
                <div className="space-y-3">
                  {analysis.suggested_strategy.split('\n').map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-warning-100 dark:bg-warning-900/30 rounded-full flex items-center justify-center text-warning-700 text-sm font-medium flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-secondary-600 dark:text-secondary-300 text-sm">{step.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Legal Points */}
            {analysis?.key_legal_points && (
              <div className="card dark:bg-secondary-900 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-accent-500" />
                  <h3 className="font-semibold text-secondary-900 dark:text-white">Key Legal Points</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.key_legal_points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                      <p className="text-secondary-600 dark:text-secondary-300 text-sm">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-xl">
              <p className="text-sm text-warning-700 dark:text-warning-400 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>
                  <strong>Disclaimer:</strong> AI analysis is for informational purposes only and does not constitute legal advice. Consult with a qualified lawyer for professional legal counsel.
                </span>
              </p>
            </div>
          </div>

          {/* Right Column - Lawyer Recommendations */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Recommended Lawyers ({recommendations.length})
              </h2>
              <Link to="/lawyers" className="text-sm link">
                View All Lawyers
              </Link>
            </div>

            {recommendations.length === 0 ? (
              <div className="card dark:bg-secondary-900 p-8 text-center">
                <Target className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">No Matching Lawyers Found</h3>
                <p className="text-secondary-500 dark:text-secondary-400">
                  Try adjusting your preferences or browse all available lawyers.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={rec.id} className="relative">
                    {index === 0 && (
                      <div className="absolute -top-3 left-4 z-10">
                        <span className="badge bg-primary-600 text-white font-medium">
                          Best Match
                        </span>
                      </div>
                    )}
                    <LawyerCard
                      lawyer={rec.lawyer}
                      recommendationScore={rec.recommendation_score}
                      recommendationReason={rec.recommendation_reason}
                      estimatedFee={rec.estimated_fee}
                      caseId={caseId}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
