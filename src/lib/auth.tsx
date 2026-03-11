'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const UserContext = createContext<{ user: User | null }>({ user: null });

export const UserProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Fetch user on initial load
    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
    }
    fetchUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <UserContext.Provider value={{ user }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider.');
  }
  return context;
};
