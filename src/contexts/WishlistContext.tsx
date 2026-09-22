import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface WishlistItem {
  id: string;
  product_id: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    supabase
      .from('wishlist')
      .select('id, product_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, [user]);

  const isInWishlist = (productId: string) => items.some(i => i.product_id === productId);

  const toggleWishlist = async (productId: string) => {
    if (!user) return;
    const existing = items.find(i => i.product_id === productId);
    if (existing) {
      await supabase.from('wishlist').delete().eq('id', existing.id);
      setItems(prev => prev.filter(i => i.product_id !== productId));
    } else {
      const { data } = await supabase
        .from('wishlist')
        .insert({ product_id: productId, user_id: user.id })
        .select('id, product_id')
        .single();
      if (data) setItems(prev => [...prev, data]);
    }
  };

  return (
    <WishlistContext.Provider value={{ items, isInWishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
