import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Defer admin check with setTimeout
        if (currentSession?.user) {
          setTimeout(() => {
            checkAdminStatus(currentSession.user.id).then(setIsAdmin);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        checkAdminStatus(currentSession.user.id).then((admin) => {
          setIsAdmin(admin);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        let errorMessage = error.message;
        
        // O'zbek tiliga tarjima qilish
        if (error.message.includes("already registered")) {
          errorMessage = "Bu email allaqachon ro'yxatdan o'tgan";
        } else if (error.message.includes("Password should be")) {
          errorMessage = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
        }
        
        toast({
          title: "Ro'yxatdan o'tish xatoligi",
          description: errorMessage,
          variant: "destructive",
        });
      }

      return { error };
    } catch (error: any) {
      // Network yoki boshqa xatolar
      const errorMessage = error.message?.includes("fetch") 
        ? "Serverga ulanishda xatolik. Iltimos, internetni tekshiring yoki keyinroq qayta urinib ko'ring."
        : error.message || "Noma'lum xatolik yuz berdi";
        
      toast({
        title: "Xatolik",
        description: errorMessage,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = error.message;
        
        // O'zbek tiliga tarjima qilish
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email yoki parol noto'g'ri";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email tasdiqlanmagan";
        }
        
        toast({
          title: "Kirish xatoligi",
          description: errorMessage,
          variant: "destructive",
        });
      }

      return { error };
    } catch (error: any) {
      // Network yoki boshqa xatolar
      const errorMessage = error.message?.includes("fetch") 
        ? "Serverga ulanishda xatolik. Iltimos, internetni tekshiring yoki keyinroq qayta urinib ko'ring."
        : error.message || "Noma'lum xatolik yuz berdi";
        
      toast({
        title: "Xatolik",
        description: errorMessage,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
