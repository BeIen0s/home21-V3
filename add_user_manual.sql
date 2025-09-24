-- Add your user to the users table manually
-- Replace the values with your actual user information

-- Your user ID from the console log: 56df67d8-d58e-4e81-87c7-6671347e57d0
INSERT INTO public.users (id, name, email, role) 
VALUES (
  '56df67d8-d58e-4e81-87c7-6671347e57d0',
  'Your Name', -- Replace with your actual name
  'your-email@example.com', -- Replace with your actual email
  'ADMIN' -- Change to SUPER_ADMIN if you want full access
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Verify the user was added
SELECT * FROM public.users WHERE id = '56df67d8-d58e-4e81-87c7-6671347e57d0';