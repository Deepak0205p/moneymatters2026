import { supabase } from './supabase';

export async function syncUserToSupabase(user, additionalData = {}) {
  if (!user?.uid || !supabase) return;

  const payload = {
    id: user.uid,
    display_name: additionalData.name || user.displayName || user.email?.split('@')[0] || '',
    email: user.email || '',
    last_sync: new Date().toISOString(),
  };

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Error syncing user to Supabase:', error);
    }
  } catch (err) {
    console.error('Exception syncing user to Supabase:', err);
  }
}

export async function fetchUserProfile(userId) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Exception fetching profile:', err);
    return null;
  }
}
