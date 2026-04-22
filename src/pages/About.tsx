import React from 'react';
import { ShieldCheck, Target, Zap, Cpu, Users, TrendingUp } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import ProfilePictureFeature from '../components/ProfilePictureFeature';

const IconMap: Record<string, React.ElementType> = {
  Target,
  TrendingUp,
  ShieldCheck,
  Zap,
  Cpu,
  Users
};

export default function About() {
  const { content } = useSite();
  const aboutData = content.about;

  if (!aboutData) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-sky-600 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{aboutData.heroTitle}</h1>
          <p className="text-xl text-sky-100 leading-relaxed max-w-2xl mx-auto">
            {aboutData.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Profile Picture Feature */}
      <section className="bg-white py-12 px-6 border-b border-slate-100 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <ProfilePictureFeature />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">{aboutData.mainTitle}</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {aboutData.mainText1}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {aboutData.mainText2}
            </p>
            <div className="flex gap-4 mt-8">
              {aboutData.metrics?.map(metric => (
                <div key={metric.id} className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1">
                  <span className="text-sky-500 font-bold text-3xl mb-1">{metric.value}</span>
                  <span className="text-slate-600 text-sm font-medium">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10 w-full bg-slate-200">
               {aboutData.mainImage ? (
                  <img 
                    src={aboutData.mainImage} 
                    alt="Professional Workspace" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                  />
               ) : (
                  <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500">
                    No image available
                  </div>
               )}
            </div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-sky-200 rounded-full blur-3xl opacity-50 z-0"></div>
          </div>
        </div>
      </section>

      {/* Core Strengths */}
      <section className="bg-white py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{aboutData.competitiveEdgeTitle}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{aboutData.competitiveEdgeSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aboutData.strengths?.map(strength => {
              const Icon = IconMap[strength.iconKey] || ShieldCheck;
              return (
                <div key={strength.id} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-sky-300 transition-colors shadow-sm hover:shadow-md">
                  <Icon className="w-12 h-12 text-sky-500 mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{strength.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {strength.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
