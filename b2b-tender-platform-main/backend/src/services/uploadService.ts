import { createClient } from '@supabase/supabase-js';

// Use the correct env variable for the service role key
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadCompanyLogo = async (
  file: Express.Multer.File,
  companyId: string
): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  const fileName = `logos/${companyId}-${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from('company-assets')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  const { data } = supabase.storage
    .from('company-assets')
    .getPublicUrl(fileName);

  if (!data || !data.publicUrl) {
    throw new Error('Failed to get public URL for uploaded file');
  }

  return data.publicUrl;
};
