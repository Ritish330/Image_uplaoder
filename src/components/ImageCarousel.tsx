import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageItem } from '../types';

interface ImageCarouselProps {
  images: ImageItem[];
  currentIndex: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  currentIndex,
  onNavigate,
}) => {
  if (images.length === 0) return null;

  const currentImage = images[currentIndex];
  const prevImage = images[(currentIndex - 1 + images.length) % images.length];
  const nextImage = images[(currentIndex + 1) % images.length];

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Navigation Buttons */}
      <button
        onClick={() => onNavigate('prev')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={() => onNavigate('next')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-all"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Image Gallery */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Previous Image (Blurred) */}
        <div className="absolute left-0 w-1/4 h-full opacity-50 blur-sm">
          <img
            src={prevImage.url}
            alt="Previous"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Current Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-2/4 h-full z-10 perspective-1000"
          >
            <motion.img
              src={currentImage.url}
              alt={currentImage.title}
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
              whileHover={{ rotateY: 5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-2">{currentImage.title}</h2>
              <p className="text-white/90">{currentImage.description}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Next Image (Blurred) */}
        <div className="absolute right-0 w-1/4 h-full opacity-50 blur-sm">
          <img
            src={nextImage.url}
            alt="Next"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};