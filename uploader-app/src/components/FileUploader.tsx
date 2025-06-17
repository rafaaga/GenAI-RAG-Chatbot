import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { FileRejection } from "react-dropzone";
import { FiUpload, FiLoader, FiFile, FiX } from "react-icons/fi";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "http://localhost:5678/webhook-test/9d912541-28f8-423f-9f67-0f3f8b99b9be",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          setMessage("¡Archivo subido exitosamente!");
          onFileUpload(file);
        } else {
          setMessage("Error al subir el archivo");
        }
      } catch (error) {
        setMessage("Error de conexión" + error);
      } finally {
        setLoading(false);
      }
    },
    [onFileUpload]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        setMessage("Por favor, sube solo archivos PDF, MP3 o MP4");
        return;
      }

      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setMessage("");
      }
    },
    []
  );

  const handleUploadClick = () => {
    if (selectedFile) {
      uploadFile(selectedFile);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setMessage("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "audio/mpeg": [".mp3"],
      "video/mp4": [".mp4"],
    },
    maxSize: 100 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div
        {...getRootProps()}
        className={`
          p-6
          border-2
          border-dashed
          rounded-lg
          text-center
          cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${selectedFile ? "border-green-500 bg-green-50" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        <FiUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        
        <p className="text-gray-600">
          {isDragActive
            ? "Suelta el archivo aquí"
            : "Arrastra un archivo o haz clic para seleccionar"}
        </p>
      </div>

      {selectedFile && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiFile className="text-blue-500" />
            <span className="text-sm text-gray-600">{selectedFile.name}</span>
          </div>
          <button
            onClick={handleClearFile}
            className="text-gray-400 hover:text-red-500"
          >
            <FiX />
          </button>
        </div>
      )}

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.includes("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleUploadClick}
          disabled={!selectedFile || loading}
          className={`
            w-full
            py-2
            px-4
            rounded-lg
            font-medium
            flex
            items-center
            justify-center
            gap-2
            ${
              !selectedFile
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <FiUpload />
              Subir Archivo
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-400">
          Formatos aceptados: PDF, MP3, MP4 (máx. 100MB)
        </p>
      </div>
    </div>
  );
};

export default FileUploader;
