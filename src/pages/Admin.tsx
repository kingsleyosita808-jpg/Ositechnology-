import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LogOut, Package, Mail, Users, TrendingUp, Presentation, LayoutDashboard, Plus, Trash2, Edit2, Check, Save, X } from 'lucide-react';
import { useSite, compressImage } from '../context/SiteContext';

export default function Admin() {
  const { slides, setSlides, content, setContent, isAdmin, setIsAdmin } = useSite();
  const [isAuthenticated, setIsAuthenticated] = useState(isAdmin);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'frontend'>('overview');
  
  // Slide edit local state
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  // Text content local state
  const [localContent, setLocalContent] = useState(content);

  // Gallery state
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>(content.home.products[0]?.id || '1');
  const [confirmDeleteGalleryId, setConfirmDeleteGalleryId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ositech809') {
      setIsAuthenticated(true);
      setIsAdmin(true);
      setError('');
      setPassword('');
      setLocalContent(content); // Sync on login
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // ----- Frontend Management Handlers -----
  const handleAddSlide = () => {
    const newSlide = {
      id: Date.now().toString(),
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'New Hardware Title',
      description: 'Describe the new hardware or service.',
    };
    setSlides([...slides, newSlide]);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert("You must have at least one slide.");
      return;
    }
    setSlides(slides.filter(s => s.id !== id));
  };

  const handleStartEdit = (slide: typeof slides[0]) => {
    setEditingSlideId(slide.id);
    setEditForm({ title: slide.title, description: slide.description });
  };

  const handleSaveEdit = (id: string) => {
    setSlides(slides.map(s => s.id === id ? { ...s, title: editForm.title, description: editForm.description } : s));
    setEditingSlideId(null);
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file);
      setSlides(slides.map(s => s.id === id ? { ...s, image: compressedDataUrl } : s));
    } catch (err) {
      alert("Failed to process the image. Please try a smaller image.");
    }
  };

  const saveContentChanges = () => {
    setContent(localContent);
    alert('Content saved successfully.');
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-md mx-auto px-6 py-24 flex flex-col items-center"
      >
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 w-full">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
            <p className="text-sm text-slate-500 mt-1">Please enter your password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
                placeholder="••••••••"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Login to Dashboard
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto px-6 py-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your website and view metrics.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center text-slate-600 hover:text-red-600 font-medium transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>

      <div className="flex border-b border-slate-200 mb-8 space-x-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-sm font-medium transition-colors flex items-center ${activeTab === 'overview' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <LayoutDashboard size={18} className="mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('frontend')}
          className={`pb-4 text-sm font-medium transition-colors flex items-center ${activeTab === 'frontend' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Presentation size={18} className="mr-2" />
          Frontend Management
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center">
                <div className="p-4 bg-sky-50 text-sky-600 rounded-lg mr-4"><Mail size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">New Messages</p>
                  <p className="text-2xl font-bold text-slate-800">12</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center">
                <div className="p-4 bg-green-50 text-green-600 rounded-lg mr-4"><TrendingUp size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Monthly Visitors</p>
                  <p className="text-2xl font-bold text-slate-800">3,492</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center">
                <div className="p-4 bg-purple-50 text-purple-600 rounded-lg mr-4"><Package size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Products Listed</p>
                  <p className="text-2xl font-bold text-slate-800">124</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center">
                <div className="p-4 bg-orange-50 text-orange-600 rounded-lg mr-4"><Users size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Subscribers</p>
                  <p className="text-2xl font-bold text-slate-800">89</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Recent Inquiries</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-sm font-medium text-slate-500">Name</th>
                      <th className="px-6 py-4 text-sm font-medium text-slate-500">Email</th>
                      <th className="px-6 py-4 text-sm font-medium text-slate-500">Subject</th>
                      <th className="px-6 py-4 text-sm font-medium text-slate-500">Date</th>
                      <th className="px-6 py-4 text-sm font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-800">Michael Johnson</td>
                      <td className="px-6 py-4 text-sm text-slate-600">mjohnson@example.com</td>
                      <td className="px-6 py-4 text-sm text-slate-800">Bulk Laptop Order</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Today, 10:42 AM</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">New</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-800">Sarah Williams</td>
                      <td className="px-6 py-4 text-sm text-slate-600">sarah.w@designco.com</td>
                      <td className="px-6 py-4 text-sm text-slate-800">Monitor Specifications</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Yesterday</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">Read</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="frontend"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Hero Slideshow Settings</h2>
                  <p className="text-slate-500 text-sm mt-1">Upload and edit the main sliding images on the home page.</p>
                </div>
                <button 
                  onClick={handleAddSlide}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-1" /> Add Slide
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((slide, index) => (
                  <div key={slide.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                    <div className="relative h-48 bg-slate-100 group">
                      <img src={slide.image} alt="Slide" className="w-full h-full object-cover" />
                      
                      {/* Image Upload Overlay */}
                      <label 
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        title="Upload new image"
                      >
                        <span className="text-white bg-black/50 px-3 py-1 rounded text-sm font-medium">Change Image</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={(e) => handleImageUpload(slide.id, e)}
                        />
                      </label>
                      <div className="absolute top-3 left-3 bg-white/90 text-slate-800 text-xs font-bold px-2 py-1 rounded">
                        Slide {index + 1}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      {editingSlideId === slide.id ? (
                        <div className="space-y-3 flex-1">
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" 
                            value={editForm.title}
                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            placeholder="Title"
                          />
                          <textarea 
                            className="w-full px-3 py-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" 
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            placeholder="Description"
                            rows={3}
                          />
                          <button 
                            onClick={() => handleSaveEdit(slide.id)}
                            className="w-full bg-green-500 text-white rounded py-2 flex items-center justify-center text-sm font-medium hover:bg-green-600 transition-colors"
                          >
                            <Check size={16} className="mr-1" /> Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-bold text-slate-800 text-lg mb-1">{slide.title}</h3>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">{slide.description}</p>
                          
                          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                            <button 
                              onClick={() => handleStartEdit(slide)}
                              className="text-sky-600 hover:text-sky-800 flex items-center text-sm font-medium"
                            >
                              <Edit2 size={16} className="mr-1" /> Edit Text
                            </button>
                            <button 
                              onClick={() => handleDeleteSlide(slide.id)}
                              className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium"
                            >
                              <Trash2 size={16} className="mr-1" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8 mt-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Gallery Management</h2>
                  <p className="text-slate-500 text-sm mt-1">Upload pictures of laptops and other hardware products.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Category to Manage</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={selectedGalleryCategory}
                      onChange={(e) => setSelectedGalleryCategory(e.target.value)}
                    >
                      {localContent.home.products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} Gallery</option>
                      ))}
                    </select>
                  </div>
                  {localContent.home.products.find(p => p.id === selectedGalleryCategory)?.image && (
                     <button
                       onClick={() => {
                         const newContent = {
                           ...localContent,
                           home: {
                             ...localContent.home,
                             products: localContent.home.products.map(p => p.id === selectedGalleryCategory ? { ...p, image: undefined } : p)
                           }
                         };
                         setLocalContent(newContent);
                         setContent(newContent);
                       }}
                       className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center whitespace-nowrap h-[42px]"
                       title="Remove the original stock photo from this card"
                     >
                       <X size={18} className="mr-1" /> Clear Stock Photo
                     </button>
                  )}
                  <label className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center whitespace-nowrap h-[42px]">
                    <Plus size={18} className="mr-1" /> Add Picture
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          const compressedDataUrl = await compressImage(file);
                          const newImage = { id: Date.now().toString(), image: compressedDataUrl, caption: '' };
                          
                          const newContent = {
                            ...localContent,
                            galleries: {
                              ...localContent.galleries,
                              [selectedGalleryCategory]: [...(localContent.galleries[selectedGalleryCategory] || []), newImage]
                            }
                          };
                          setLocalContent(newContent);
                          setContent(newContent); // Save globally
                          
                          e.target.value = ''; // reset file input
                        } catch (err) {
                          console.error("Failed to process the image. Try a smaller file.");
                        }
                      }}
                    />
                  </label>
                </div>
                
                {/* Image List Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {(localContent.galleries[selectedGalleryCategory] || []).map((img, idx) => (
                      <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex flex-col">
                        <div className="relative aspect-square">
                          <img src={img.image} alt={`Gallery item ${idx}`} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 flex gap-2 transition-opacity">
                            <label className="bg-sky-500 hover:bg-sky-600 text-white p-1.5 rounded-full flex items-center justify-center cursor-pointer shadow-sm" title="Replace image">
                              <Edit2 size={14} />
                              <input 
                                type="file" 
                                accept="image/*"
                                className="hidden" 
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  try {
                                    const compressedDataUrl = await compressImage(file);
                                    const updatedGallery = localContent.galleries[selectedGalleryCategory].map(i => 
                                      i.id === img.id ? { ...i, image: compressedDataUrl } : i
                                    );
                                    const newContent = {
                                      ...localContent,
                                      galleries: {
                                        ...localContent.galleries,
                                        [selectedGalleryCategory]: updatedGallery
                                      }
                                    };
                                    setLocalContent(newContent);
                                    setContent(newContent);
                                    e.target.value = '';
                                  } catch (err) {
                                    console.error("Failed to replace the image. Try a smaller file.");
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        <div className="p-3 space-y-2 border-t border-slate-200 bg-white flex-1">
                          <input
                            type="text"
                            placeholder="Product Name"
                            value={img.caption || ''}
                            onChange={(e) => {
                              const updatedGallery = localContent.galleries[selectedGalleryCategory].map(i =>
                                i.id === img.id ? { ...i, caption: e.target.value } : i
                              );
                              setLocalContent(prev => ({
                                ...prev,
                                galleries: { ...prev.galleries, [selectedGalleryCategory]: updatedGallery }
                              }));
                            }}
                            className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:border-sky-500"
                          />
                          <input
                            type="text"
                            placeholder="Price (e.g. $999)"
                            value={img.price || ''}
                            onChange={(e) => {
                              const updatedGallery = localContent.galleries[selectedGalleryCategory].map(i =>
                                i.id === img.id ? { ...i, price: e.target.value } : i
                              );
                              setLocalContent(prev => ({
                                ...prev,
                                galleries: { ...prev.galleries, [selectedGalleryCategory]: updatedGallery }
                              }));
                            }}
                            className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:border-sky-500 font-medium text-emerald-600"
                          />
                          {confirmDeleteGalleryId === img.id ? (
                            <div className="flex gap-2 w-full mt-2">
                              <button
                                onClick={() => {
                                  const newContent = {
                                    ...localContent,
                                    galleries: {
                                      ...localContent.galleries,
                                      [selectedGalleryCategory]: localContent.galleries[selectedGalleryCategory].filter(i => i.id !== img.id)
                                    }
                                  };
                                  setLocalContent(newContent);
                                  setContent(newContent);
                                  setConfirmDeleteGalleryId(null);
                                }}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1.5 text-sm font-medium rounded focus:outline-none transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDeleteGalleryId(null)}
                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1.5 text-sm font-medium rounded focus:outline-none transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteGalleryId(img.id)}
                              className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1.5 text-sm font-medium border border-red-100 rounded focus:outline-none flex items-center justify-center gap-1 transition-colors"
                              title="Delete image completely"
                            >
                              <Trash2 size={16} /> Delete Image
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                   {(localContent.galleries[selectedGalleryCategory] || []).length === 0 && (
                     <div className="col-span-full py-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-lg">
                       No images in {localContent.home.products.find(p => p.id === selectedGalleryCategory)?.name} gallery yet.
                     </div>
                   )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8 mt-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Home Page Text</h2>
                  <p className="text-slate-500 text-sm mt-1">Update main introductory text on your home page.</p>
                </div>
                <button onClick={saveContentChanges} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                  <Save size={18} className="mr-1" /> Save All Settings
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={localContent.home.heroTitle} onChange={(e) => setLocalContent({...localContent, home: {...localContent.home, heroTitle: e.target.value}})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
                  <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" rows={3}
                    value={localContent.home.heroSubtitle} onChange={(e) => setLocalContent({...localContent, home: {...localContent.home, heroSubtitle: e.target.value}})}></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Home Products (Cards) Management</h2>
                  <p className="text-slate-500 text-sm mt-1">Edit or delete the Laptop, Screen, Keyboard, Battery sections.</p>
                </div>
                <button 
                  onClick={() => {
                    const newId = Date.now().toString();
                    setLocalContent(prev => ({
                      ...prev,
                      home: {
                        ...prev.home,
                        products: [...prev.home.products, { id: newId, name: 'New Product', desc: 'Description of the new product.', iconKey: 'Laptop' }]
                      }
                    }));
                  }}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-1" /> Add Card
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {localContent.home.products.map(product => (
                  <div key={product.id} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-1 space-y-3 w-full">
                      <input 
                        type="text" 
                        value={product.name}
                        onChange={(e) => {
                          setLocalContent(prev => ({
                            ...prev,
                            home: {
                              ...prev.home,
                              products: prev.home.products.map(p => p.id === product.id ? { ...p, name: e.target.value } : p)
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                        placeholder="Product Name (e.g. Laptops)"
                      />
                      <textarea 
                        value={product.desc}
                        onChange={(e) => {
                          setLocalContent(prev => ({
                            ...prev,
                            home: {
                              ...prev.home,
                              products: prev.home.products.map(p => p.id === product.id ? { ...p, desc: e.target.value } : p)
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        placeholder="Description"
                        rows={2}
                      />
                    </div>
                        <div className="flex flex-col md:flex-row gap-2 shrink-0">
                          <label className="text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-lg transition-colors flex items-center font-medium cursor-pointer" title="Add Pictures">
                            <Plus size={16} className="mr-2" /> Add Pictures
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={async (e) => {
                                const fileList = e.target.files;
                                if (!fileList || fileList.length === 0) return;
                                
                                const newImages: any[] = [];
                                for (let i = 0; i < fileList.length; i++) {
                                  const file = fileList[i];
                                  try {
                                    const compressedDataUrl = await compressImage(file);
                                    newImages.push({ id: Date.now().toString() + Math.random(), image: compressedDataUrl, caption: '', price: '' });
                                  } catch (err) {
                                    console.error("Failed to process image.");
                                  }
                                }
                                
                                const newContent = {
                                  ...localContent,
                                  galleries: {
                                    ...localContent.galleries,
                                    [product.id]: [...(localContent.galleries[product.id] || []), ...newImages]
                                  }
                                };
                                setLocalContent(newContent);
                                setContent(newContent);
                                e.target.value = '';
                              }}
                            />
                          </label>
                          <button 
                            onClick={() => {
                              setLocalContent(prev => ({
                                ...prev,
                                home: {
                                  ...prev.home,
                                  products: prev.home.products.filter(p => p.id !== product.id)
                                }
                              }));
                            }}
                            className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors flex items-center font-medium"
                            title="Delete Card"
                          >
                            <Trash2 size={16} className="mr-2" /> Delete
                          </button>
                        </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Vision Page Text</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vision Title</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={localContent.vision.title} onChange={(e) => setLocalContent({...localContent, vision: {...localContent.vision, title: e.target.value}})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vision Description</label>
                  <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" rows={3}
                    value={localContent.vision.description} onChange={(e) => setLocalContent({...localContent, vision: {...localContent.vision, description: e.target.value}})}></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">About Us Page Content</h2>
              
              {/* Image Upload for About Page */}
              <div className="mb-6 flex flex-col md:flex-row gap-4 items-start">
                <div className="relative w-full md:w-1/3 aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  {localContent.about?.mainImage ? (
                    <img src={localContent.about.mainImage} alt="About Us Main" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <label className="bg-sky-500 hover:bg-sky-600 text-white p-1.5 rounded-full flex items-center justify-center cursor-pointer shadow-sm" title="Upload Image">
                      <Edit2 size={14} />
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const compressedDataUrl = await compressImage(file);
                            setLocalContent({...localContent, about: {...localContent.about, mainImage: compressedDataUrl}});
                          } catch (err) {
                            console.error("Failed to replace the image.");
                          }
                        }}
                      />
                    </label>
                    {localContent.about?.mainImage && (
                      <button
                        onClick={() => setLocalContent({...localContent, about: {...localContent.about, mainImage: ''}})}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                        title="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex-1 w-full space-y-4 text-sm text-slate-600">
                  <p>Upload a high-quality professional image to represent your company on the About page.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={localContent.about?.heroTitle || ''} onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, heroTitle: e.target.value}})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Main Heading</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={localContent.about?.mainTitle || ''} onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, mainTitle: e.target.value}})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={localContent.about?.heroSubtitle || ''} onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, heroSubtitle: e.target.value}})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Paragraph 1</label>
                  <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" rows={3}
                    value={localContent.about?.mainText1 || ''} onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, mainText1: e.target.value}})}></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Paragraph 2</label>
                  <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" rows={3}
                    value={localContent.about?.mainText2 || ''} onChange={(e) => setLocalContent({...localContent, about: {...localContent.about, mainText2: e.target.value}})}></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Contact Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Title</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={localContent.contact.title} onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, title: e.target.value}})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={localContent.contact.phone} onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, phone: e.target.value}})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={localContent.contact.email} onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, email: e.target.value}})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Official Address</label>
                  <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" rows={2}
                    value={localContent.contact.address} onChange={(e) => setLocalContent({...localContent, contact: {...localContent.contact, address: e.target.value}})}></textarea>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
