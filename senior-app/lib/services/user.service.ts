import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export class UserService {
  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data || null;
  }

  /**
   * Create a new user
   */
  static async createUser(user: UserInsert): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      // @ts-ignore - Supabase type inference issue with users
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create user');

    return data as User;
  }

  /**
   * Update user information
   */
  static async updateUser(id: string, updates: UserUpdate): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      // @ts-ignore - Supabase type inference issue with users
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update user');

    return data as User;
  }

  /**
   * Get family members linked to a senior
   */
  static async getFamilyMembers(seniorId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('family_links')
      .select('family_id, users!family_links_family_id_fkey(*)')
      .eq('senior_id', seniorId);

    if (error) throw error;
    if (!data) return [];

    return data.map((link: any) => link.users);
  }

  /**
   * Get seniors linked to a family member
   */
  static async getLinkedSeniors(familyId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('family_links')
      .select('senior_id, users!family_links_senior_id_fkey(*)')
      .eq('family_id', familyId);

    if (error) throw error;
    if (!data) return [];

    return data.map((link: any) => link.users);
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<User | null> {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return null;

    return this.getUserById(authUser.id);
  }

  /**
   * Upload profile image
   */
  static async uploadProfileImage(
    userId: string,
    file: File
  ): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update user profile with new image URL
    await this.updateUser(userId, { profile_image_url: publicUrl });

    return publicUrl;
  }
}
