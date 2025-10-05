import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function ImageResizingPage() {
  const query = useQuery();
  const imageId = query.get('imageId');
  const imageUrl = query.get('imageUrl') || '';
  const caption = query.get('caption') || '';
  const [platform, setPlatform] = useState('instagram');
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyResize = async () => {
    if (!imageId) {
      setError('Missing image id.');
      return;
    }
    setLoading(true);
    setError(null);
    setResultUrl('');
    try {
      const authToken = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:8000/api/resize-image/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
        },
        body: JSON.stringify({ image_id: imageId, target_platform: platform }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.detail || 'Failed to resize');
      }
      const data = await res.json();
      if (data.image) setResultUrl(`http://localhost:8000${data.image}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'resized_image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Resize for Platform</h2>
      <div className="mb-4">
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded" className="rounded-lg shadow w-full h-auto" />
        ) : (
          <div className="border border-dashed rounded-lg p-6 text-gray-500 text-center">Image Preview</div>
        )}
      </div>

      <div className="mb-4">
        <label className="font-semibold mb-2 block">Choose Platform</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="border rounded-md p-2">
          <option value="instagram">Instagram (Square)</option>
          <option value="facebook">Facebook</option>
          <option value="twitter">Twitter</option>
        </select>
      </div>

      {/* Caption overlay removed per request */}

      {error && <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}

      <div className="flex gap-2">
        <button onClick={applyResize} disabled={loading} className="flex-1 inline-flex justify-center px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md disabled:opacity-50">
          {loading ? 'Applying...' : 'Apply Resize'}
        </button>
        {resultUrl && (
          <>
            <button onClick={download} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Download</button>
            <a
              href={`/dashboard/share-social?imageUrl=${encodeURIComponent(resultUrl)}&caption=${encodeURIComponent(caption)}`}
              className="px-4 py-2 bg-purple-600 text-white rounded-md"
            >
              Next
            </a>
          </>
        )}
      </div>

      {resultUrl && (
        <div className="mt-4">
          <p className="font-semibold mb-1">Resized Preview:</p>
          <img src={resultUrl} alt="Resized" className="rounded-lg shadow w-full h-auto" />
        </div>
      )}
    </div>
  );
}

export default ImageResizingPage;
