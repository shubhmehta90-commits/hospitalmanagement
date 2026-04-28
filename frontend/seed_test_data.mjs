import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const TEST_PASSWORD = 'Password123!';

async function seed() {
  console.log('🚀 Starting Seed Process...');

  const users = [
    { email: 'admin@test.com', name: 'System Admin', role: 'admin' },
    { email: 'dr.smith@test.com', name: 'Dr. Sarah Smith', role: 'doctor', spec: 'Cardiology', exp: 12 },
    { email: 'dr.jones@test.com', name: 'Dr. Michael Jones', role: 'doctor', spec: 'Pediatrics', exp: 8 },
    { email: 'john.doe@test.com', name: 'John Doe', role: 'patient', age: 34, gender: 'male' },
    { email: 'jane.doe@test.com', name: 'Jane Doe', role: 'patient', age: 29, gender: 'female' },
  ];

  for (const u of users) {
    console.log(`Creating ${u.role}: ${u.email}...`);
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: TEST_PASSWORD,
      options: {
        data: {
          full_name: u.name,
          role: u.role
        }
      }
    });

    if (error) {
      console.error(`Error creating ${u.email}:`, error.message);
      continue;
    }

    const userId = data.user.id;
    await new Promise(r => setTimeout(r, 800)); // Wait for trigger

    if (u.role === 'doctor') {
      await supabase.from('doctors').insert([{ id: userId, specialization: u.spec, experience: u.exp }]);
    } else if (u.role === 'patient') {
      await supabase.from('patients').insert([{ id: userId, age: u.age, gender: u.gender }]);
    }
  }

  console.log('✅ Seed Finished! (Password: Password123!)');
}

seed();
