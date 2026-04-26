import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, MapPin, Mail, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { submitInquiry } from '../services/supabaseService';

export default function Contact() {
  const { content } = useSite();
  const { title, subtitle, address, email, phone } = content.contact;
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Create the structure specifically for our Supabase table
    const inquiryData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string || "New Contact Form Submission",
      message: formData.get('message') as string,
    };

    // First try saving to Supabase
    const savedToDB = await submitInquiry(inquiryData);
    
    if (!savedToDB) {
      console.warn("Failed to save to Supabase database. Falling back to email only...");
    }

    // Now shoot it via formsubmit for email notification
    // (This ensures you still get the email even if DB fails)
    const emailData = {
      ...inquiryData,
      _subject: inquiryData.subject,
    };

    let emailSent = false;
    try {
      const response = await fetch("https://formsubmit.co/ajax/ositakingsley69@gmail.com", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(emailData)
      });
      if (response.ok) {
        emailSent = true;
      } else {
        console.error("Formsubmit responded with an error");
      }
    } catch (e) {
      console.error("Failed to send email notification", e);
    }

    if (!savedToDB && !emailSent) {
      alert("Failed to send message. Please try again later.");
      setStatus('idle');
      return;
    }

    setStatus('sent');
    form.reset();
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-semibold text-slate-900 mb-6 whitespace-pre-wrap">
            {title}
          </h1>
          <p className="text-lg text-slate-600 mb-10 whitespace-pre-wrap">
            {subtitle}
          </p>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-lg mr-4">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900">Headquarters</h4>
                <p className="text-slate-600 mt-1 whitespace-pre-wrap">{address}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-lg mr-4">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900">Email Us</h4>
                <p className="text-slate-600 mt-1">
                  <a href={`mailto:${email}`} className="hover:text-sky-600 transition-colors">
                    {email}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-lg mr-4">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900">Call Us</h4>
                <p className="text-slate-600 mt-1">{phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-2xl font-medium text-slate-900 mb-6">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
                  placeholder="jane@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
                placeholder="Bulk Laptop Inquiry"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
              <textarea 
                id="message" 
                name="message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={status !== 'idle'}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {status === 'idle' && (
                <>
                  <Send size={18} className="mr-2" />
                  Send Message
                </>
              )}
              {status === 'sending' && 'Sending...'}
              {status === 'sent' && 'Message Sent!'}
            </button>
          </form>
        </div>

      </div>
    </motion.div>
  );
}
