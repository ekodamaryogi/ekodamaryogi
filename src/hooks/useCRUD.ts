import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type DataType = 'skills' | 'experience' | 'projects' | 'certifications' | 'cv_settings';

export function useCRUD<T extends { id: string }>(key: DataType) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const { data: fetchedData, error } = await supabase
      .from(key)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error(`Error fetching ${key}:`, error);
    } else {
      setData(fetchedData as unknown as T[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // If Supabase keys are missing (e.g. not configured yet), fallback logic could go here
    // but for this implementation we assume Supabase is set up.
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      fetchData();
    } else {
      console.warn("Supabase URL not set. Data cannot be fetched.");
      setIsLoading(false);
    }
  }, [key]);

  const add = async (item: Omit<T, 'id' | 'created_at'>) => {
    const { data: insertedData, error } = await supabase
      .from(key)
      .insert([item as any])
      .select();

    if (error) {
      console.error(`Error adding to ${key}:`, error);
      alert('Failed to add item. Check console.');
    } else if (insertedData) {
      setData([...data, insertedData[0] as unknown as T]);
    }
  };

  const update = async (id: string, updatedFields: Partial<T>) => {
    const { error } = await supabase
      .from(key)
      .update(updatedFields as any)
      .eq('id', id);

    if (error) {
      console.error(`Error updating ${key}:`, error);
      alert('Failed to update item. Check console.');
    } else {
      setData(data.map(item => item.id === id ? { ...item, ...updatedFields } : item));
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase
      .from(key)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting from ${key}:`, error);
      alert('Failed to delete item. Check console.');
    } else {
      setData(data.filter(item => item.id !== id));
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      alert('Failed to upload image. Make sure storage bucket exists and policies are set.');
      return null;
    }

    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  return { data, add, update, remove, uploadImage, isLoading };
}
