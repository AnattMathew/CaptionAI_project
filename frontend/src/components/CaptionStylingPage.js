import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const STYLE_OPTIONS = [
  { value: 'normal', label: 'Normal (Original)', description: 'Keep the original generated caption' },
  { value: 'humorous', label: 'Humorous', description: 'Fun and playful with a touch of humor' },
  { value: 'poetic', label: 'Poetic', description: 'Artistic and lyrical style' },
];

function CaptionStylingPage() {
  const query = useQuery();
  const imageId = query.get('imageId');
  const initialCaption = query.get('caption') || '';
  const imageUrl = query.get('imageUrl') || '';

  const [style, setStyle] = useState('normal');
  const [originalCaption, setOriginalCaption] = useState(initialCaption);
  const [styledCaption, setStyledCaption] = useState(initialCaption);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyStyle = async () => {
    if (!imageId) {
      setError('Missing image id. Generate a caption first.');
      return;
    }

    // Handle "normal" style - just restore original caption
    if (style === 'normal') {
      setStyledCaption(originalCaption);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/style-caption/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
        },
        body: JSON.stringify({ image_id: imageId, style }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.detail || 'Failed to style');
      }
      const data = await res.json();
      setStyledCaption(data.caption || originalCaption);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Style Your Caption</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose from different caption styles to match your content's tone and personality.
        </p>
      </div>

      {/* Image Section */}
      <div className="mb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Your Image
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            {imageUrl ? (
              <img src={imageUrl} alt="Uploaded" className="w-full h-auto max-h-96 object-cover" />
            ) : (
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">No image available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Caption Comparison */}
      <div className="mb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Original Caption
            </h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <p className="text-gray-800 leading-relaxed">{originalCaption || 'No caption available'}</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              Styled Caption
            </h3>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <p className="text-gray-800 leading-relaxed">{styledCaption || 'Select a style to see the result'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Style Selection */}
      <div className="mb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Choose Your Style</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STYLE_OPTIONS.map(opt => (
              <div
                key={opt.value}
                className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                  style === opt.value
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                }`}
                onClick={() => setStyle(opt.value)}
              >
                <div className="flex items-center mb-4">
                  <input 
                    type="radio" 
                    name="style" 
                    value={opt.value} 
                    checked={style === opt.value} 
                    onChange={() => setStyle(opt.value)}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-800">{opt.label}</h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{opt.description}</p>
                
                {/* Style Icon */}
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center ${
                  style === opt.value ? 'bg-indigo-500' : 'bg-gray-200'
                }`}>
                  {opt.value === 'normal' && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {opt.value === 'humorous' && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                    </svg>
                  )}
                  {opt.value === 'poetic' && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={applyStyle} 
          disabled={loading} 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Applying Style...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              Apply Style
            </>
          )}
        </button>
        
        <a
          href={`/dashboard/translate-caption?imageId=${encodeURIComponent(imageId || '')}&caption=${encodeURIComponent(styledCaption || '')}&imageUrl=${encodeURIComponent(imageUrl || '')}`}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Next: Translate
        </a>
      </div>
    </div>
  );
}

export default CaptionStylingPage;
