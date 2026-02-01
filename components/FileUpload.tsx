import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onImageSelected: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onImageSelected }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onImageSelected(e.dataTransfer.files[0]);
      }
    },
    [onImageSelected]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <div
      className="w-full max-w-xl mx-auto p-8 rounded-3xl border-4 border-dashed border-pastelBlue bg-pastelYellow/30 cursor-pointer hover:bg-pastelYellow/50 transition-colors duration-300 text-center group"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
          <ImageIcon className="w-12 h-12 text-pastelPink" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            여기에 사진을 올려주세요! 📸
          </h3>
          <p className="text-gray-500 font-medium">
            또는 클릭해서 사진 선택하기
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-400 font-bold border border-gray-100">JPG</span>
          <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-400 font-bold border border-gray-100">PNG</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;