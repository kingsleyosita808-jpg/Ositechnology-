import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteData, saveSiteData } from '../services/supabaseService';

export interface Slide {
  id: string;
  image: string;
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  desc: string;
  iconKey: string;
  image?: string;
}

export interface GalleryImage {
  id: string;
  image: string;
  caption: string;
  price?: string;
}

export interface SiteContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    products: Product[];
  };
  vision: {
    title: string;
    description: string;
    coreValues: Array<{ id: string; title: string; desc: string; iconKey: string }>;
  };
  about: {
    heroTitle: string;
    heroSubtitle: string;
    mainTitle: string;
    mainText1: string;
    mainText2: string;
    mainImage: string;
    metrics: Array<{ id: string; value: string; label: string }>;
    competitiveEdgeTitle: string;
    competitiveEdgeSubtitle: string;
    strengths: Array<{ id: string; title: string; desc: string; iconKey: string }>;
  };
  contact: {
    title: string;
    subtitle: string;
    address: string;
    email: string;
    phone: string;
  };
  galleries: Record<string, GalleryImage[]>;
  profilePicture?: string | null;
}

const defaultSlides: Slide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Premium Laptops',
    description: 'High-performance machines for business and tech professionals.',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'High-Fidelity Displays',
    description: 'Crystal clear screens that boost your productivity.',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Mechanical Keyboards',
    description: 'Tactile typing experience for maximum efficiency.',
  }
];

const defaultContent: SiteContent = {
  home: {
    heroTitle: "Equipping Professionals for Success",
    heroSubtitle: "At OSITECHNOLOGY, we provide business leaders and tech experts with the hardware they need to perform at their highest potential. Reliability meets performance.",
    products: [
      { id: '1', name: 'Laptops', desc: 'Powerful processing for demanding workflows.', iconKey: 'Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: '2', name: 'Screens', desc: 'Vibrant displays for unmatched clarity.', iconKey: 'Monitor', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: '3', name: 'Keyboards', desc: 'Reliable and responsive input devices.', iconKey: 'Keyboard', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { id: '4', name: 'Batteries', desc: 'Long-lasting power to keep you working.', iconKey: 'Battery', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]
  },
  vision: {
    title: "Our Vision",
    description: "To empower global professionals and businesses by delivering standard-setting technological hardware and unmatched service dependability.",
    coreValues: [
      { id: '1', title: 'Uncompromising Quality', desc: 'We source and supply only the most reliable hardware perfectly suited for rigorous professional environments.', iconKey: 'Target' },
      { id: '2', title: 'Driving Innovation', desc: 'We stay ahead of technological curves, ensuring our clients always have access to next-generation tools.', iconKey: 'TrendingUp' },
      { id: '3', title: 'Trust & Integrity', desc: 'Building long-term partnerships through transparent business practices and dependable customer support.', iconKey: 'ShieldCheck' }
    ]
  },
  about: {
    heroTitle: "About OSITECHNOLOGY",
    heroSubtitle: "We don't just supply hardware; we empower businesses with the technological foundation they need to dominate their industries.",
    mainTitle: "Uncompromising Quality. Unmatched Reliability.",
    mainText1: "At OSITECHNOLOGY, we recognize that your business operations are only as strong as the technology that powers them. That is why we source and supply only the highest-tier laptops, screens, keyboards, and enterprise-grade batteries.",
    mainText2: "Founded on the principles of excellence and integrity, our mission is to eliminate hardware constraints for professionals. When you partner with us, you are not merely purchasing equipment; you are investing in a seamless, high-performance future for your entire organization.",
    mainImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    metrics: [
      { id: '1', value: '100%', label: 'Quality Assured' },
      { id: '2', value: '24/7', label: 'Client Support' }
    ],
    competitiveEdgeTitle: "Our Competitive Edge",
    competitiveEdgeSubtitle: "We hold ourselves to the highest standards, ensuring our clients receive nothing but the best in tech hardware.",
    strengths: [
      { id: '1', title: 'Premium Sourcing', desc: 'We partner directly with leading global manufacturers to ensure every laptop, monitor, and peripheral meets strict enterprise-grade standards.', iconKey: 'ShieldCheck' },
      { id: '2', title: 'Rapid Deployment', desc: 'Time is revenue. Our streamlined logistics network guarantees swift processing and delivery, getting you fully operational without delay.', iconKey: 'Zap' },
      { id: '3', title: 'Tailored Solutions', desc: 'We do not believe in one-size-fits-all. We provide consultative supply services, aligning our hardware recommendations directly with your strategic goals.', iconKey: 'Target' }
    ]
  },
  contact: {
    title: "Get in Touch",
    subtitle: "Whether you are outfitting a new office or upgrading your personal workstation, OSITECHNOLOGY is ready to assist you.",
    address: "124 Tech Boulevard\nInnovation District, CA 90210",
    email: "ositakingsley69@gmail.com",
    phone: "+1 (555) 123-4567"
  },
  galleries: {
    '1': [],
    '2': [],
    '3': [],
    '4': []
  },
  profilePicture: null
};

interface SiteContextType {
  slides: Slide[];
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [slides, setSlides] = useState<Slide[]>(() => {
    const saved = localStorage.getItem('ositech-slides');
    return saved ? JSON.parse(saved) : defaultSlides;
  });

  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('ositech-content');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean up previous default stock laptop photos from localStorage automatically
      if (parsed.galleries && parsed.galleries['1']) {
        parsed.galleries['1'] = parsed.galleries['1'].filter((img: any) => 
          !['img-1', 'img-2', 'img-3'].includes(img.id)
        );
      }
      
      const laptopProduct = parsed.home?.products?.find((p: any) => p.id === '1');
      if (laptopProduct && laptopProduct.image === 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') {
         laptopProduct.image = undefined;
      }

      // If Batteries product is missing from localStorage dynamically from previous versions, add it back in
      const hasBatteries = parsed.home?.products?.find((p: any) => p.id === '4');
      if (parsed.home?.products && !hasBatteries) {
        parsed.home.products.push({ id: '4', name: 'Batteries', desc: 'Long-lasting power to keep you working.', iconKey: 'Battery', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' });
      }
      
      const batteryProduct = parsed.home?.products?.find((p: any) => p.id === '4');
      if (batteryProduct && batteryProduct.image === 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') {
         batteryProduct.image = undefined; // Don't show default placeholder image on load
      }
      
      // Remove the 4th picture in battery card once based on user request
      if (!localStorage.getItem('removed_battery_pic_4_v1')) {
        if (parsed.galleries && parsed.galleries['4'] && parsed.galleries['4'].length >= 4) {
          parsed.galleries['4'].splice(3, 1);
          localStorage.setItem('removed_battery_pic_4_v1', 'true');
        }
      }
      
      return { ...defaultContent, ...parsed };
    }
    
    // Process default state for no-photo start on laptops and batteries
    const finalDefault = { ...defaultContent };
    const defaultLaptop = finalDefault.home.products.find(p => p.id === '1');
    if (defaultLaptop) {
      defaultLaptop.image = undefined;
    }
    const defaultBattery = finalDefault.home.products.find(p => p.id === '4');
    if (defaultBattery) {
      defaultBattery.image = undefined;
    }
    
    return finalDefault;
  });

  useEffect(() => {
    const initData = async () => {
      const data = await fetchSiteData();
      if (data) {
        if (data.slides) setSlides(data.slides);
        if (data.content) setContent(data.content);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ositech-slides', JSON.stringify(slides));
    } catch (e) { 
      console.warn('Local storage limit reached for slides, but proceeding with cloud sync.'); 
    }
    
    if (isAdmin) {
      saveSiteData(content, slides).catch(err => console.error("Cloud sync failed", err));
    }
  }, [slides, isAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem('ositech-content', JSON.stringify(content));
    } catch (e) { 
      console.warn('Local storage limit reached for content, but proceeding with cloud sync.'); 
    }
    
    if (isAdmin) {
      saveSiteData(content, slides).catch(err => console.error("Cloud sync failed", err));
    }
  }, [content, isAdmin]);

  return (
    <SiteContext.Provider value={{ slides, setSlides, content, setContent, isAdmin, setIsAdmin }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};
