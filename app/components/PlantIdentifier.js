"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CameraIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";

export default function PlantIdentifier() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
  }, [showCamera]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        identifyPlant(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      console.log("Attempting to start camera...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      console.log("Camera stream obtained:", stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Video element source set");
      } else {
        console.error("Video ref is null");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(`Unable to access camera: ${err.message}`);
      setShowCamera(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current) {
      console.error("Video ref is null");
      setError("Unable to capture image: video feed not available");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    setImage(imageDataUrl);
    setShowCamera(false);
    identifyPlant(imageDataUrl);

    // Stop all video streams
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const identifyPlant = async (imageData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
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

  const resetState = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setShowCamera(false);
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-green-700">
        Plant Identifier
      </h2>

      <div className="flex justify-center space-x-2 md:space-x-4 mb-4 md:mb-6">
        <button
          onClick={() => {
            resetState();
            fileInputRef.current.click();
          }}
          className="bg-green-600 text-white py-2 px-3 md:px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center text-sm md:text-base"
        >
          <ArrowUpTrayIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
          Upload Image
        </button>
        <button
          onClick={() => {
            resetState();
            setShowCamera(true);
          }}
          className="bg-blue-600 text-white py-2 px-3 md:px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center text-sm md:text-base"
        >
          <CameraIcon className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
          Take Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {showCamera && (
        <div className="mb-4 md:mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <button
            onClick={captureImage}
            className="mt-2 md:mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 w-full text-sm md:text-base"
          >
            Capture Image
          </button>
        </div>
      )}

      {image && (
        <div className="mb-4 md:mb-6">
          <Image
            src={image}
            alt="Captured plant"
            width={300}
            height={300}
            className="rounded-lg mx-auto"
          />
        </div>
      )}

      {loading && (
        <p className="text-center text-sm md:text-base">Identifying plant...</p>
      )}

      {error && (
        <div className="mt-4 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm md:text-base">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 md:mt-6 bg-green-100 p-3 md:p-4 rounded-lg border border-green-200">
          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-green-800">
            Plant Details:
          </h3>
          <div className="space-y-1 md:space-y-2 text-green-900 text-sm md:text-base">
            <p>
              <strong>Name:</strong> {result.name}
            </p>
            <p>
              <strong>Scientific Name:</strong> <em>{result.scientificName}</em>
            </p>
            <p>
              <strong>Description:</strong> {result.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
