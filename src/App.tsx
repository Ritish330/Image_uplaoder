import React, { useState, useRef } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageCarousel } from './components/ImageCarousel';
import { Navbar } from './components/Navbar';
import { CameraModal } from './components/CameraModal';
import { ImageItem } from './types';
import { GalleryVertical as Gallery } from 'lucide-react';

function App() {
  const [images, setImages] = useState<ImageItem[]>([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1682687220742-aba19b51f36d',
      title: 'Sunset Mountains',
      description: 'A beautiful mountain range at sunset with vibrant colors in the sky.'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1682687221038-404670bd5b8c',
      title: 'Ocean Waves',
      description: 'Powerful waves crashing against the shore during golden hour.'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b',
      title: 'Forest Path',
      description: 'A mystical path through an ancient forest covered in morning mist.'
    }
  ]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const uploadRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage: ImageItem = {
        id: Date.now(),
        url: e.target?.result as string,
        title: file.name.split('.')[0],
        description: 'Click to add description'
      };
      setImages((prev) => [...prev, newImage]);
      setIsUploadVisible(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (imageData: string) => {
    const newImage: ImageItem = {
      id: Date.now(),
      url: imageData,
      title: `Camera Photo ${new Date().toLocaleString()}`,
      description: 'Photo taken from camera'
    };
    setImages((prev) => [...prev, newImage]);
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    setCurrentIndex((prev) => {
      if (direction === 'prev') {
        return (prev - 1 + images.length) % images.length;
      }
      return (prev + 1) % images.length;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Gallery className="w-8 h-8" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Modern Image Gallery
          </h1>
        </div>

        {/* Navigation */}
        <Navbar 
          onUploadClick={() => setIsUploadVisible(true)}
          onCameraClick={() => setIsCameraOpen(true)}
          activePage={activePage}
          onPageChange={setActivePage}
        />

        {/* Main Content */}
        <div className="space-y-12 mt-8">
          {/* Image Carousel */}
          {images.length > 0 && (
            <ImageCarousel
              images={images}
              currentIndex={currentIndex}
              onNavigate={handleNavigation}
            />
          )}

          {/* Upload Section */}
          {isUploadVisible && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
              <div ref={uploadRef} className="max-w-md w-full">
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}

export default App;