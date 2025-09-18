import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const { login, logout, user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Get user profile and role
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          logout();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const [{ data: profile }, { data: role }] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId).single(),
        supabase.from('user_roles').select('role').eq('user_id', userId).single()
      ]);

      if (profile) {
        login({
          id: userId,
          name: profile.full_name || profile.email,
          email: profile.email,
          role: role?.role === 'admin' ? 'teacher' : 'student', // Map admin to teacher for now
          avatar: undefined
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'teacher' | 'student') => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) {
        toast({
          title: "Signup Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Account Created",
        description: "Please check your email to verify your account",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    signIn,
    signUp,
    signOut
  };
};