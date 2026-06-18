import { supabase } from './supabase';

/**
 * Fetch user profile from Supabase.
 * @param {string} userId - Firebase User UID
 * @returns {Promise<object|null>} The user profile data if it exists, or null
 */
export async function fetchUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching Supabase profile:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Exception fetching Supabase profile:', err);
    return null;
  }
}

/**
 * Upsert (insert or update) user profile in Supabase.
 * @param {string} userId - Firebase User UID
 * @param {object} profileData - Data to sync (coins, streak, badges, xp, etc.)
 */
export async function syncUserProfile(userId, profileData) {
  if (!userId) return;

  const payload = {
    id: userId,
    display_name: profileData.displayName || profileData.userName || '',
    email: profileData.email || '',
    coins: profileData.coins || 0,
    streak: profileData.streak || 0,
    xp: profileData.xp || 0,
    level: profileData.level || 1,
    completed_modules: profileData.completedModules || [],
    badges: profileData.badges || [],
    goals: profileData.goals || [],
    expenses: profileData.expenses || [],
    last_sync: new Date().toISOString()
  };

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Error syncing profile to Supabase:', error);
    }
  } catch (err) {
    console.error('Exception syncing profile to Supabase:', err);
  }
}
