import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function ProfilePictureFeature() {
  const { content, setContent, isAdmin } = useSite();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profilePic = content.profilePicture;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setContent(prev => ({
          ...prev,
          profilePicture: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPicture = (e: React.MouseEvent) => {
    e.stopPropagation();
    setContent(prev => ({
      ...prev,
      profilePicture: null
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div 
        className="relative group cursor-pointer flex flex-col items-center"
        onClick={() => profilePic && setIsFullscreen(true)}
      >
        {/* Circular Avatar */}
        <div className="w-48 h-48 rounded-full border-4 border-sky-100 shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center relative transition-transform duration-300 hover:scale-105">
          {profilePic ? (
            <img 
              src={profilePic} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-slate-400 flex flex-col items-center">
              <Camera size={48} className="mb-2 opacity-50" />
              <span className="text-sm font-medium">No Picture</span>
            </div>
          )}

          {/* Admin Upload Overlay */}
          {isAdmin && (
            <div 
              className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-10"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Camera size={28} className="text-white" />
              <span className="text-white font-bold text-sm">Upload Profile</span>
              {profilePic && (
                <button 
                  onClick={clearPicture}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 mt-2"
                  title="Remove Picture"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Caption */}
        <h2 className="mt-6 text-2xl font-bold text-slate-800 uppercase tracking-widest">
          Profile Picture
        </h2>
      </div>

      {/* Hidden File Input */}
      {isAdmin && (
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef}
          className="hidden" 
          onChange={handleUpload} 
        />
      )}

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isFullscreen && profilePic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsFullscreen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-[101]"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
            >
              <X size={32} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-full w-auto h-auto relative bg-transparent flex items-center justify-center overflow-hidden rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
            >
              <img 
                src={profilePic} 
                alt="Profile Fullscreen" 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
