const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧹 Manual session cleanup...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceCleanup() {
  try {
    console.log('1️⃣ Checking current session...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log(`Found session for user: ${session.user.id} (${session.user.email})`);
      
      if (session.user.id === '77c5af80-882a-46e1-bf69-7c4a7b1bd506') {
        console.log('2️⃣ Problematic session detected, signing out...');
        await supabase.auth.signOut();
        console.log('✅ Session cleared');
      } else {
        console.log('ℹ️ Session looks normal');
      }
    } else {
      console.log('ℹ️ No active session found');
    }

    console.log('3️⃣ Checking if problematic user exists in database...');
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', '77c5af80-882a-46e1-bf69-7c4a7b1bd506');
    
    if (error) {
      console.error('Database query error:', error);
    } else if (userData && userData.length > 0) {
      console.log('⚠️ Problematic user found in database:', userData[0]);
      console.log('4️⃣ Deleting problematic user from database...');
      
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', '77c5af80-882a-46e1-bf69-7c4a7b1bd506');
      
      if (deleteError) {
        console.error('Failed to delete user:', deleteError);
      } else {
        console.log('✅ Problematic user deleted from database');
      }
    } else {
      console.log('✅ No problematic user in database');
    }

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

forceCleanup().then(() => {
  console.log('\n🏁 Cleanup completed. Please:');
  console.log('1. Restart your dev server');
  console.log('2. Clear your browser cache completely');
  console.log('3. Try accessing the app again');
  process.exit(0);
});