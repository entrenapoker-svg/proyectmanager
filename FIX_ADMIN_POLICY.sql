-- FIX: Infinite Recursion in Profiles Policy
-- Run this in Supabase SQL Editor

-- Step 1: Create a helper function that bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop the broken policy
DROP POLICY IF EXISTS "Profiles visible by self and admin" ON profiles;

-- Step 3: Create a new, fixed policy
CREATE POLICY "Profiles visible by self and admin" ON profiles 
FOR SELECT USING (
  auth.uid() = id OR public.is_admin()
);

-- Step 4: Make yourself admin (REPLACE WITH YOUR EMAIL!)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'TU_EMAIL_AQUI';
