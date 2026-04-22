import { motion } from 'motion/react';
import { Target, TrendingUp, ShieldCheck } from 'lucide-react';
import { useSite } from './context/SiteContext';

const iconMap: Record<string, any> = {
  Target,
  TrendingUp,
  ShieldCheck
};

export default function Vision() {
  const { content } = useSite();
  const { title, description, coreValues } = content.vision;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-6 whitespace-pre-wrap">
          {title}
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
        {coreValues.map((val, idx) => {
          const IconComponent = iconMap[val.iconKey] || Target;
          return (
            <motion.div 
              key={val.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="p-4 bg-sky-50 rounded-2xl text-sky-600 mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                <IconComponent size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-3">{val.title}</h3>
              <p className="text-slate-600 whitespace-pre-wrap">{val.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
