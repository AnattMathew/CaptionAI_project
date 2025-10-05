import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const STYLE_OPTIONS = [
  { value: 'formal', label: 'Formal' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'poetic', label: 'Poetic' },
];

function CaptionStylingPage() {
  const query = useQuery();
  const imageId = query.get('imageId');
  const initialCaption = query.get('caption') || '';
  const imageUrl = query.get('imageUrl') || '';

  const [style, setStyle] = useState('formal');
  const [caption, setCaption] = useState(initialCaption);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyStyle = async () => {
    if (!imageId) {
      setError('Missing image id. Generate a caption first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:8000/api/style-caption/', {
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
      setCaption(data.caption || caption);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Style Caption</h2>

      <div className="mb-4">
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded" className="rounded-lg shadow w-full h-auto" />
        ) : (
          <div className="border border-dashed rounded-lg p-6 text-gray-500 text-center">Image Preview</div>
        )}
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-1">Caption:</p>
        <div className="min-h-[140px] p-3 bg-gray-50 border rounded-md whitespace-pre-wrap">
          {caption || '—'}
        </div>
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-2">Choose Style:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {STYLE_OPTIONS.map(opt => (
            <label key={opt.value} className={`cursor-pointer flex items-center gap-2 border rounded-md p-2 ${style === opt.value ? 'border-teal-600' : 'border-gray-300'}`}>
              <input type="radio" name="style" value={opt.value} checked={style === opt.value} onChange={() => setStyle(opt.value)} />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>
      )}

      <div className="flex gap-2">
        <button onClick={applyStyle} disabled={loading} className="flex-1 inline-flex justify-center px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md disabled:opacity-50">
          {loading ? 'Applying...' : 'Apply Style'}
        </button>
        <a
          href={`/dashboard/translate-caption?imageId=${encodeURIComponent(imageId || '')}&caption=${encodeURIComponent(caption || '')}&imageUrl=${encodeURIComponent(imageUrl || '')}`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md inline-flex items-center"
        >
          Next
        </a>
      </div>
    </div>
  );
}

export default CaptionStylingPage;
