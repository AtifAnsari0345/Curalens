import { useState, useRef } from 'react';

function UploadDropzone({ onFileSelect, onStartProcessing, isProcessing, selectedFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      onFileSelect(newFile);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.includes('image') || droppedFile.type === 'application/pdf')) {
      onFileSelect(droppedFile);
    } else {
      // Show error for unsupported file type
      alert('Please upload an image (JPEG/PNG) or PDF file.');
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="upload-container">
      <div 
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        role="button"
        tabIndex="0"
        aria-label="Upload prescription image or PDF"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p>Drag & drop a prescription image or PDF here  or click to browse files</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*,.pdf" 
          style={{ display: 'none' }} 
          aria-hidden="true"
        />
      </div>
      
      {selectedFile && (
        <div className="file-info">
          <p>Selected file: {selectedFile.name}</p>
          <button 
            className="button" 
            onClick={() => onStartProcessing(selectedFile)}
            disabled={isProcessing}
            aria-label="Start OCR processing"
          >
            {isProcessing ? (
              <>
                <div className="spinner-small"></div>
                <span>Processing...</span>
              </>
            ) : (
              'Start OCR'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadDropzone;