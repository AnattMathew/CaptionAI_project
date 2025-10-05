import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const LANGS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'kn', label: 'Kannada' },
  { value: 'mr', label: 'Marathi' },
  { value: 'bn', label: 'Bengali' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'ur', label: 'Urdu' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
];

function CaptionTranslationPage() {
  const query = useQuery();
  const imageId = query.get('imageId');
  const imageUrl = query.get('imageUrl') || '';
  const initialCaption = query.get('caption') || '';

  const [language, setLanguage] = useState('es');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const doTranslate = async () => {
    if (!imageId) {
      setError('Missing image id.');
      return;
    }
    setLoading(true);
    setError(null);
    setTranslated('');
    try {
      const authToken = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:8000/api/translate-caption/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
        },
        body: JSON.stringify({ image_id: imageId, target_language: language }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.detail || 'Failed to translate');
      }
      const data = await res.json();
      setTranslated(data.translated_caption || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Translate Caption</h2>

      <div className="mb-4">
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded" className="rounded-lg shadow w-full h-auto" />
        ) : (
          <div className="border border-dashed rounded-lg p-6 text-gray-500 text-center">Image Preview</div>
        )}
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-1">Styled Caption:</p>
        <div className="min-h-[100px] p-3 bg-gray-50 border rounded-md whitespace-pre-wrap">
          {initialCaption || '—'}
        </div>
      </div>

      <div className="mb-4">
        <label className="font-semibold mb-2 block">Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border rounded-md p-2">
          {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>
      )}

      <div className="flex gap-2">
        <button onClick={doTranslate} disabled={loading} className="flex-1 inline-flex justify-center px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md disabled:opacity-50">
          {loading ? 'Translating...' : 'Translate'}
        </button>
        <a
          href={`/dashboard/resize-image?imageId=${encodeURIComponent(imageId || '')}&imageUrl=${encodeURIComponent(imageUrl || '')}&caption=${encodeURIComponent(translated || initialCaption)}`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md inline-flex items-center"
        >
          Next
        </a>
      </div>

      {translated && (
        <div className="mt-4">
          <p className="font-semibold mb-1">Translated Caption:</p>
          <div className="min-h-[100px] p-3 bg-green-50 border rounded-md whitespace-pre-wrap">
            {translated}
          </div>
        </div>
      )}
    </div>
  );
}

export default CaptionTranslationPage;
