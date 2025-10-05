import React, { useState } from "react";

function ImageUploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const authToken = localStorage.getItem('authToken');
      const res = await fetch("http://localhost:8000/api/upload/", {
        method: "POST",
        headers: {
          ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        let message = 'Upload failed';
        try {
          const errorData = await res.json();
          message = errorData.error || errorData.detail || JSON.stringify(errorData);
        } catch (_) {
          try {
            const text = await res.text();
            if (text) message = text;
          } catch (_) {}
        }
        throw new Error(`${message} (status ${res.status})`);
      }

      const data = await res.json().catch(() => ({}));
      setSuccessMessage("Image uploaded successfully.");
      // If we have an id and image url, offer navigation to caption page
      if (data && data.id && data.image) {
        const url = new URL(window.location.href);
        // Keep user within dashboard
        window.location.href = `/dashboard/generate-caption?imageId=${data.id}&imageUrl=${encodeURIComponent(`http://localhost:8000${data.image}`)}`;
      }
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    setSuccessMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxBytes = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Unsupported file type. Only JPEG and PNG are allowed.");
      setFile(null);
      return;
    }

    if (selectedFile.size > maxBytes) {
      setError("File size exceeds 10MB limit.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Upload an Image</h2>
      <p className="text-center text-gray-600">JPEG / PNG only (Max 10MB)</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => validateAndSetFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && (
        <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mt-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploadPage;
