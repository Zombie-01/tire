import { supabase } from './supabase';

export interface UploadResult {
  url: string | null;
  error: string | null;
}

export async function uploadImage(file: File, bucket: string = 'images'): Promise<UploadResult> {
  if (!supabase) {
    return { url: null, error: 'Supabase тохиргоо хийгдээгүй байна' };
  }

  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'Зөвхөн зураг файл оруулах боломжтой' };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: 'Файлын хэмжээ 5MB-аас бага байх ёстой' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error: 'Файл хуулахад алдаа гарлаа' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { url: null, error: 'Файл хуулахад алдаа гарлаа' };
  }
}

export async function deleteImage(url: string, bucket: string = 'images'): Promise<boolean> {
  if (!supabase || !url) return false;

  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${bucket}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

// Initialize storage bucket (call this once when setting up)
export async function initializeStorageBucket(bucketName: string = 'images') {
  if (!supabase) return false;

  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

    if (!bucketExists) {
      // Create bucket
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (error) {
        console.error('Bucket creation error:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    return false;
  }
}