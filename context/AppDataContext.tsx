
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
// FIX: Added 'Comment' to the import list to resolve type error.
import { Product, Category, Article, Seller, Review, Order, Post, LiveSession, Promotion, Comment, Influencer, FinancialTransaction, Conversation } from '../types';
import apiService from '../services/apiService';

interface AppDataContextType {
  products: Product[];
  categories: Category[];
  articles: Article[];
  sellers: Seller[];
  reviews: Review[];
  orders: Order[];
  posts: Post[];
  liveSessions: LiveSession[];
  promotions: Promotion[];
  influencers: Influencer[];
  financialTransactions: FinancialTransaction[];
  conversations: Conversation[];
  isLoading: boolean;
  error: Error | null;
  
  // Mutation functions
  addProduct: (productData: Omit<Product, '_id' | 'status'>) => Promise<void>;
  addArticle: (articleData: Omit<Article, '_id' | 'author' | 'publishDate'>, author: string) => Promise<void>;
  addReview: (reviewData: Omit<Review, '_id' | 'date'>) => Promise<void>;
  addOrder: (orderData: Omit<Order, '_id' | 'date' | 'status'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  addPost: (postData: Omit<Post, '_id'|'likes'|'comments'|'timestamp'>) => Promise<void>;
  addComment: (postId: string, commentData: Omit<Comment, '_id'>) => Promise<void>;
  addLiveSession: (sessionData: Omit<LiveSession, '_id' | 'status' | 'start_time' | 'end_time' | 'google_calendar_event_id' | 'google_meet_link'>) => Promise<LiveSession | undefined>;
  addPromotion: (promoData: Omit<Promotion, '_id'|'status'>) => Promise<void>;
  updateSellerDetails: (sellerId: string, details: Partial<Seller>) => Promise<void>;
}

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        productsData, categoriesData, articlesData, sellersData, 
        reviewsData, ordersData, postsData, liveSessionsData, promotionsData,
        influencersData, financialTransactionsData, conversationsData
      ] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
        apiService.getArticles(),
        apiService.getSellers(),
        apiService.getReviews(),
        apiService.getOrders(),
        apiService.getPosts(),
        apiService.getLiveSessions(),
        apiService.getPromotions(),
        apiService.getInfluencers(),
        apiService.getFinancialTransactions(),
        apiService.getConversations(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setArticles(articlesData);
      setSellers(sellersData);
      setReviews(reviewsData);
      setOrders(ordersData);
      setPosts(postsData);
      setLiveSessions(liveSessionsData);
      setPromotions(promotionsData);
      setInfluencers(influencersData);
      setFinancialTransactions(financialTransactionsData);
      setConversations(conversationsData);
      
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Failed to fetch app data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Mutation Implementations ---
  const addProduct = async (productData: Omit<Product, '_id' | 'status'>) => {
    const newProduct = await apiService.addProduct(productData);
    setProducts(prev => [newProduct, ...prev]);
  };

  const addArticle = async (articleData: Omit<Article, '_id' | 'author' | 'publishDate'>, author: string) => {
    const fullArticleData = { ...articleData, author, publishDate: new Date().toISOString() };
    const newArticle = await apiService.addArticle(fullArticleData);
    setArticles(prev => [newArticle, ...prev]);
  };
  
  const addReview = async (reviewData: Omit<Review, '_id' | 'date'>) => {
    const fullReviewData = { ...reviewData, date: new Date().toISOString() };
    const newReview = await apiService.addReview(fullReviewData);
    setReviews(prev => [newReview, ...prev]);
  };
  
  const addOrder = async (orderData: Omit<Order, '_id' | 'date' | 'status'>) => {
     const fullOrderData = { ...orderData, date: new Date().toISOString(), status: 'dikemas' as const };
     const newOrder = await apiService.addOrder(fullOrderData);
     setOrders(prev => [newOrder, ...prev]);
  };
  
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updatedOrder = await apiService.updateOrderStatus(orderId, status);
    if (updatedOrder) {
      setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
    }
  };

  const addPost = async (postData: Omit<Post, '_id'|'likes'|'comments'|'timestamp'>) => {
    const newPost = await apiService.addPost(postData);
    setPosts(prev => [newPost, ...prev]);
  };
  
  const addComment = async (postId: string, commentData: Omit<Comment, '_id'>) => {
    const newComment = await apiService.addComment(postId, commentData);
    if (newComment) {
       setPosts(prevPosts => prevPosts.map(p => {
         if (p._id === postId) {
           return { ...p, comments: [...p.comments, newComment] };
         }
         return p;
       }));
    }
  };

  const addLiveSession = async (sessionData: Omit<LiveSession, '_id' | 'status' | 'start_time' | 'end_time' | 'google_calendar_event_id' | 'google_meet_link'>): Promise<LiveSession | undefined> => {
    // This function now simulates calling the backend.
    // The backend would handle Google API calls.
    const newSession = await apiService.addLiveSession(sessionData);
    if(newSession) {
        setLiveSessions(prev => [newSession, ...prev]);
    }
    return newSession;
  };
  
  const addPromotion = async (promoData: Omit<Promotion, '_id'|'status'>) => {
      const newPromo = await apiService.addPromotion(promoData);
      setPromotions(prev => [newPromo, ...prev]);
  };
  
  const updateSellerDetails = async (sellerId: string, details: Partial<Seller>) => {
      const updatedSeller = await apiService.updateSellerDetails(sellerId, details);
      if(updatedSeller) {
          setSellers(prev => prev.map(s => s._id === sellerId ? updatedSeller : s));
      }
  };

  const value = {
    products, categories, articles, sellers, reviews, orders, posts, liveSessions, promotions, influencers, financialTransactions, conversations,
    isLoading,
    error,
    addProduct,
    addArticle,
    addReview,
    addOrder,
    updateOrderStatus,
    addPost,
    addComment,
    addLiveSession,
    addPromotion,
    updateSellerDetails,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};