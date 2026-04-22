import { supabase } from '../lib/supabaseClient';
import { SiteContent, Slide } from '../context/SiteContext';

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
