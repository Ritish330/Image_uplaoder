import React from 'react';
import { Home, Info, Phone, Upload, Camera } from 'lucide-react';

interface NavbarProps {
  onUploadClick: () => void;
  onCameraClick: () => void;
  activePage: string;
  onPageChange: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onUploadClick, 
  onCameraClick, 
  activePage,
  onPageChange 
}) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', href: '#' },
    { id: 'about', icon: Info, label: 'About', href: '#about' },
    { id: 'contact', icon: Phone, label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md rounded-full py-3 px-6">
      <div className="container mx-auto flex items-center justify-between flex-wrap gap-4">
        {/* Main Navigation */}
        <div className="flex items-center justify-center flex-1 gap-2">
          {navItems.map(({ id, icon: Icon, label, href }) => (
            <a
              key={id}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(id);
              }}
              className={`
                px-6 py-2 rounded-full flex items-center gap-2 transition-all
                ${activePage === id 
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCameraClick}
            className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full flex items-center gap-2 transition-all"
          >
            <Camera className="w-5 h-5" />
            <span>Camera</span>
          </button>
          <button
            onClick={onUploadClick}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/30"
          >
            <Upload className="w-5 h-5" />
            <span>Upload</span>
          </button>
        </div>
      </div>
    </nav>
  );
};