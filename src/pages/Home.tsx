import React from 'react';
import Slideshow from '../components/Slideshow';
import { Laptop, Keyboard, Monitor, Battery, Plus, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useSite, compressImage } from '../context/SiteContext';

const iconMap: Record<string, any> = {
  Laptop,
  Monitor,
  Keyboard,
  Battery
};

interface HomeProps {
  onNavigateToGallery: (categoryId: string) => void;
}

export default function Home({ onNavigateToGallery }: HomeProps) {
  const { content, setContent, isAdmin } = useSite();
  const { heroTitle, heroSubtitle, products } = content.home;

  const handleUploadCover = async (categoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const newImages = [];
      for (let i = 0; i < files.length; i++) {
        const compressedDataUrl = await compressImage(files[i]);
        newImages.push({ 
          id: Date.now().toString() + '-' + i, 
          image: compressedDataUrl, 
          caption: '' 
        });
      }
      
      setContent(prev => {
        // Prepend all successfully processed new images at once to the front of the gallery.
        const updatedGallery = [...newImages, ...(prev.galleries[categoryId] || [])];
        return {
          ...prev,
          galleries: {
            ...prev.galleries,
            [categoryId]: updatedGallery
          }
        };
      });
      
      e.target.value = ''; // Reset input so it can be re-used directly
    } catch {
      console.error("Failed to process the images.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      {/* Slideshow is explicitly placed below the navigation as requested */}
      <Slideshow />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 whitespace-pre-wrap">
            {heroTitle}
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto whitespace-pre-wrap">
            {heroSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item, idx) => {
            const IconComponent = iconMap[item.iconKey] || Laptop;
            const galleryImages = content.galleries?.[item.id] || [];
            const displayImage = galleryImages.length > 0 ? galleryImages[0].image : item.image;

            return (
              <motion.div 
                key={item.id}
                onClick={() => onNavigateToGallery(item.id)}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-lg shadow-slate-300/50 border border-slate-200 hover:shadow-2xl hover:shadow-slate-400/50 transition-all cursor-pointer overflow-hidden flex flex-col group relative"
              >
                {/* Admin Direct Upload Cover */}
                {isAdmin && (
                  <label 
                    onClick={(e) => { e.stopPropagation(); }} 
                    onPointerDown={(e) => { e.stopPropagation(); }}
                    className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white text-sky-600 px-3 py-2 rounded-full cursor-pointer flex items-center shadow-sm text-xs font-bold transition-colors"
                  >
                    <Plus size={14} className="mr-1" />
                    Upload Image(s)
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onClick={(e) => e.stopPropagation()} 
                      onChange={(e) => handleUploadCover(item.id, e)} 
                    />
                  </label>
                )}

                {/* Product Image Cover */}
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  {displayImage ? (
                    <img src={displayImage} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-sky-50">
                      <IconComponent size={48} className="text-sky-300" strokeWidth={1} />
                    </div>
                  )}
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-sky-600 z-10">
                    <IconComponent size={20} strokeWidth={2} />
                  </div>
                </div>

                <div className="p-6 text-left flex-1 flex flex-col items-start">
                  <h3 className="text-xl font-medium text-slate-800 mb-2">{item.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap flex-1">
                    {item.desc}
                  </p>
                  <div className="mt-5 w-full flex justify-start">
                    <span className="inline-flex items-center text-sky-600 bg-sky-50 group-hover:bg-sky-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                      View Gallery
                      <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        &rarr;
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </motion.div>
  );
}
