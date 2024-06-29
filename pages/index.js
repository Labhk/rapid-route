// Home.js
import { useState } from 'react';
import { storage } from '@/firebase/config'; // Assuming you've initialized Firebase storage in firebase.js
import { ref, uploadBytes } from 'firebase/storage';

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      // Construct reference to the file in Firebase Storage
      const storageRef = ref(storage, `uploads/${file.name}`);

      // Upload file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Extract uploaded file name from file object
      const fileName = file.name.split('.html')[0];

      setUploadedFileName(fileName);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-14 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Upload HTML File Here</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".html"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Upload
          </button>
        </form>
        {uploadedFileName && (
          <p className="mt-4">
            File uploaded successfully! View it at:{' '}
            <a
              href={`/up/${uploadedFileName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:underline"
            >
              visit {uploadedFileName}.html
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
