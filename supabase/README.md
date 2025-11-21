# Supabase Setup Instructions

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project

## Database Setup

1. Go to the SQL Editor in your Supabase dashboard
2. Run the schema file: `supabase/schema.sql`

## Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `audio-files`
3. Set the bucket to public
4. Add the following policy to allow uploads:

```sql
-- Allow authenticated users to upload audio files
CREATE POLICY "Users can upload audio files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio-files');

-- Allow everyone to download audio files
CREATE POLICY "Anyone can download audio files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio-files');

-- Allow users to delete their own audio files
CREATE POLICY "Users can delete own audio files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Environment Variables

Create a `.env` file in the root directory with the following:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace with your actual Supabase URL and anon key from the project settings.

## Authentication Setup

This app uses Supabase Auth but without requiring email/password signup. Users are created automatically with anonymous authentication or can set a username.
