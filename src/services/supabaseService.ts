import { supabase } from '../lib/supabaseClient';
import { SiteContent, Slide } from '../context/SiteContext';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read';
  created_at: string;
}

export const saveSiteData = async (content: SiteContent, slides: Slide[]) => {
  try {
    const { error } = await supabase
      .from('site_data')
      .upsert({ 
        id: 1, 
        content: content, 
        slides: slides,
        updated_at: new Date().toISOString() 
      });
    
    if (error) {
      console.error('Error saving to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save failed:', err);
    return false;
  }
};

export const fetchSiteData = async () => {
  try {
    const { data, error } = await supabase
      .from('site_data')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is code for "no rows returned"
        console.error('Error fetching from Supabase:', error);
      }
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase fetch failed:', err);
    return null;
  }
};

export const submitInquiry = async (data: Omit<Inquiry, 'id' | 'created_at' | 'status'>) => {
  try {
    const { error } = await supabase
      .from('inquiries')
      .insert([
        { ...data, status: 'new' }
      ]);
    
    if (error) {
      console.error('Error submitting inquiry to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase inquiry submit failed:', err);
    return false;
  }
};

export const fetchInquiries = async (): Promise<Inquiry[]> => {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching inquiries from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Supabase fetch inquiries failed:', err);
    return [];
  }
};

export const markInquiryRead = async (id: string) => {
  try {
    const { error } = await supabase
      .from('inquiries')
      .update({ status: 'read' })
      .eq('id', id);
    
    if (error) {
      console.error('Error marking inquiry as read:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to mark inquiry as read:', err);
    return false;
  }
};
