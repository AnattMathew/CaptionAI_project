import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function CaptionGenerationPage() {
  const query = useQuery();
  const initialImageUrl = query.get('imageUrl') || '';
  const imageId = query.get('imageId');

  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!imageId) {
      setError('Missing image id. Please upload an image first.');
      return;
    }
    setLoading(true);
    setError(null);
    setCaption('');
    try {
      const authToken = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:8000/api/generate-caption/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
        },
        body: JSON.stringify({ image_id: imageId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.detail || 'Failed to generate caption');
      }
      const data = await res.json();
      setCaption(data.caption || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generate Caption</h2>
      <div>
        {initialImageUrl ? (
          <img src={initialImageUrl} alt="Uploaded" className="rounded-lg shadow w-full h-auto" />
        ) : (
          <div className="border border-dashed rounded-lg p-6 text-gray-500 text-center">Image Preview</div>
        )}
      </div>

      <div className="mt-4">
        <p className="font-semibold mb-2">Caption:</p>
        <div className="min-h-[120px] p-3 bg-gray-50 border rounded-md whitespace-pre-wrap">
          {caption || (error ? `Error: ${error}` : '—')}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 inline-flex justify-center px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Caption'}
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading || !caption}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Regenerate
        </button>
        <a
          href={`/dashboard/style-caption?imageId=${encodeURIComponent(imageId || '')}&caption=${encodeURIComponent(caption || '')}&imageUrl=${encodeURIComponent(initialImageUrl || '')}`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md inline-flex items-center"
        >
          Next
        </a>
      </div>
    </div>
  );
}

export default CaptionGenerationPage;
