// components/PlantIdentifier.js
"use client";

import { useState } from "react";
import Image from "next/image";

export default function PlantIdentifier() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const identifyPlant = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);
    } catch (error) {
      console.error("Error identifying plant:", error);
      setError(error.message || "Failed to identify plant. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Plant Identifier
      </h1>
      <div className="mb-6">
        <label
          htmlFor="image-upload"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Upload a plant image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
      </div>
      {image && (
        <div className="mb-6">
          <Image
            src={image}
            alt="Uploaded plant"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
      )}
      <button
        onClick={identifyPlant}
        disabled={!image || loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
      >
        {loading ? "Identifying..." : "Identify Plant"}
      </button>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      {result && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold mb-3 text-green-800">
            Results:
          </h2>
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-green-700">Name:</h3>
              <p className="ml-2">{result.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-700">Scientific Name:</h3>
              <p className="ml-2 italic">{result.scientificName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-700">Description:</h3>
              <p className="ml-2 text-sm">{result.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
