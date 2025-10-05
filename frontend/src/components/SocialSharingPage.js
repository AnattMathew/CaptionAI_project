import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function SocialSharingPage() {
  const query = useQuery();
  const imageUrl = query.get('imageUrl') || '';
  const caption = query.get('caption') || '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      alert('Caption copied to clipboard');
    } catch (_) {
      alert('Copy failed');
    }
  };

  const download = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'share_image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  const shareInstagram = async () => {
    if (!imageUrl) return alert('No image to share');
    try {
      const authToken = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:8000/api/share-instagram/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
        },
        body: JSON.stringify({ image_url: imageUrl, caption }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.detail || 'Failed to share');
      }
      alert('Posted to Instagram successfully');
    } catch (err) {
      alert(`Share failed: ${err.message}`);
    }
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(imageUrl)}`;
    window.open(url, '_blank', 'noopener');
  };

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}&quote=${encodeURIComponent(caption)}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Download & Share</h2>

      <div className="mb-4">
        {imageUrl ? (
          <img src={imageUrl} alt="Final" className="rounded-lg shadow w-full h-auto" />
        ) : (
          <div className="border border-dashed rounded-lg p-6 text-gray-500 text-center">Image Preview</div>
        )}
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-1">Caption:</p>
        <div className="min-h-[100px] p-3 bg-gray-50 border rounded-md whitespace-pre-wrap">{caption || '—'}</div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={download} className="flex-1 inline-flex justify-center px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md">Download Image</button>
        <button onClick={copy} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Copy Caption</button>
        <button onClick={shareInstagram} className="px-4 py-2 bg-pink-600 text-white rounded-md">Share to Instagram</button>
        <button onClick={shareTwitter} className="px-4 py-2 bg-sky-500 text-white rounded-md">Share to Twitter</button>
        <button onClick={shareFacebook} className="px-4 py-2 bg-blue-700 text-white rounded-md">Share to Facebook</button>
      </div>
    </div>
  );
}

export default SocialSharingPage;
