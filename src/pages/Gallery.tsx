import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ZoomIn, Plus, Trash2, Edit2, ShoppingCart } from 'lucide-react';
import { useSite, compressImage, GalleryImage } from '../context/SiteContext';

interface GalleryProps {
  categoryId: string;
  onBack: () => void;
}

export default function Gallery({ categoryId, onBack }: GalleryProps) {
  const { content, setContent, isAdmin } = useSite();
  const category = content.home.products.find(p => p.id === categoryId);
  const images = content.galleries[categoryId] || [];
  
  const [selectedImage, setSelectedImage] = React.useState<GalleryImage | null>(null);

  if (!category) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await compressImage(file);
      const newImage = { id: Date.now().toString(), image: compressedDataUrl, caption: '' };
      setContent(prev => ({
        ...prev,
        galleries: {
          ...prev.galleries,
          [categoryId]: [...(prev.galleries[categoryId] || []), newImage]
        }
      }));
    } catch {
      console.error("Failed to process the image.");
    }
  };

  const handleDelete = (id: string) => {
    setContent(prev => ({
      ...prev,
      galleries: {
        ...prev.galleries,
        [categoryId]: prev.galleries[categoryId].filter(img => img.id !== id)
      }
    }));
  };

  const handleEdit = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await compressImage(file);
      setContent(prev => ({
        ...prev,
        galleries: {
          ...prev.galleries,
          [categoryId]: prev.galleries[categoryId].map(img => 
            img.id === id ? { ...img, image: compressedDataUrl } : img
          )
        }
      }));
    } catch {
      console.error("Failed to replace the image.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto px-6 py-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center text-sky-600 hover:text-sky-800 font-medium mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{category.name} Gallery</h1>
          <p className="text-lg text-slate-600">{category.desc}</p>
        </div>
        {isAdmin && (
          <label className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 rounded-xl font-medium transition-colors cursor-pointer inline-flex items-center shadow-sm">
            <Plus size={20} className="mr-2" />
            Upload New Picture
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        )}
      </div>

      {images.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-lg text-slate-500">No images have been uploaded to this gallery yet.</p>
          <p className="text-sm text-slate-400 mt-2">Administrators can add images using the Upload button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <motion.div 
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-[4/3] bg-slate-100 flex flex-col"
              onClick={() => setSelectedImage(img)}
            >
              <div className="relative w-full h-full flex-1">
                <img 
                  src={img.image} 
                  alt={img.caption || `Gallery image ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex flex-col justify-center items-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg border border-white/30">
                      <ZoomIn size={24} />
                    </div>
                  </div>
                </div>
              </div>
              {(img.caption || img.price) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/90 to-transparent flex justify-between items-end">
                  <div className="flex-1 pr-4">
                    {img.caption && <h3 className="text-white font-medium text-lg leading-tight drop-shadow-md truncate">{img.caption}</h3>}
                  </div>
                  {img.price && <div className="text-sky-300 font-bold text-lg whitespace-nowrap drop-shadow-md">{img.price}</div>}
                </div>
              )}

              {/* Admin Actions Overlay */}
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full flex items-center justify-center cursor-pointer shadow-md" title="Replace image" onClick={(e) => e.stopPropagation()}>
                    <Edit2 size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleEdit(img.id, e)} />
                  </label>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                    title="Delete image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox with Purchasing Professional Layout */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50 bg-slate-800/50 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-w-5xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              
              {/* Image Section */}
              <div className="flex-1 bg-slate-100 flex items-center justify-center relative min-h-[40vh] md:min-h-0 bg-black">
                <motion.img 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={selectedImage.image} 
                  alt={selectedImage.caption || "Product view"} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Product Details Section */}
              <div className="w-full md:w-96 bg-white p-8 flex flex-col justify-between border-l border-slate-100 overflow-y-auto">
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-bold tracking-wider uppercase mb-4">
                    {category.name}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight">
                    {selectedImage.caption || `${category.name} Product`}
                  </h2>
                  <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
                    High-quality hardware ready for your professional workspace. Check our available stock and order today to equip your office.
                  </p>

                  {selectedImage.price ? (
                    <div className="mb-6 border border-slate-100 rounded-xl p-4 bg-slate-50">
                      <span className="block text-sm font-medium text-slate-500 mb-1">Price</span>
                      <span className="text-3xl font-bold text-slate-900">{selectedImage.price}</span>
                    </div>
                  ) : (
                    <div className="mb-6 border border-slate-100 rounded-xl p-4 bg-slate-50">
                      <span className="block text-sm font-medium text-slate-500 mb-1">Price</span>
                      <span className="text-xl font-bold text-slate-700 italic">Contact for pricing</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mt-4">
                  <a 
                    href={`mailto:${content.contact.email}?subject=Order Inquiry: ${selectedImage.caption || category.name}`}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-xl font-bold flex items-center justify-center transition-colors shadow-md shadow-sky-600/20"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Order Product
                  </a>
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="w-full py-4 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
