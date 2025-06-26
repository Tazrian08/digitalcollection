import { useState, useEffect } from 'react';
import { WishlistItem } from '../types';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('digitalcollection-wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('digitalcollection-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (productId: string) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.find(item => item.productId === productId);
      if (!exists) {
        return [...prevItems, { productId, addedAt: new Date() }];
      }
      return prevItems;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => 
      prevItems.filter(item => item.productId !== productId)
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
};