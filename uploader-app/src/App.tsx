import React from 'react';
import FileUploader from './components/FileUploader'

const App: React.FC = () => {
  const handleFileUpload = (file: File) => {
    console.log('Archivo subido:', file.name);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Subir Archivo
        </h1>
        <FileUploader onFileUpload={handleFileUpload} />
      </div>
    </div>
  );
};

export default App;
