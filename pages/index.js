// Home.js
import { useState } from 'react';
import { storage } from '@/firebase/config'; // Assuming you've initialized Firebase storage in firebase.js
import { ref, uploadBytes } from 'firebase/storage';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).map(file => ({
        file: new File([file], file.name.replace(/\s+/g, '-'), { type: file.type }),
        status: 'pending'
      }));
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = files.map(async (fileObj) => {
      try {
        const storageRef = ref(storage, `uploads/${fileObj.file.name}`);
        await uploadBytes(storageRef, fileObj.file);
        const fileName = fileObj.file.name.split('.html')[0];
        return {
          name: fileName,
          url: `/up/${fileName}`,
          status: 'success'
        };
      } catch (error) {
        console.error('Error uploading file:', error);
        return {
          name: fileObj.file.name,
          status: 'error',
          error: error.message
        };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...results]);
      setFiles([]); // Clear the files array after successful upload
    } catch (error) {
      console.error('Error in batch upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Upload HTML Files</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
            <input
              type="file"
              accept=".html"
              onChange={handleFileChange}
              multiple
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-gray-300 hover:text-white"
            >
              Click to select files or drag and drop
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Selected Files:</h2>
              {files.map((fileObj, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                  <span>{fileObj.file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={files.length === 0 || isUploading}
            className={`w-full py-2 px-4 rounded ${
              isUploading || files.length === 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </form>

        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Uploaded Files:</h2>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className={file.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                      {file.status === 'success' ? '✓' : '✕'}
                    </span>
                    <span>{file.name}</span>
                  </div>
                  {file.status === 'success' && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-400"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
