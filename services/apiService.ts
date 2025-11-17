import * as db from './mockDatabase';
import { Product, Order, Article, Review, Post, Comment, LiveSession, Promotion, Seller } from '../types';

const NETWORK_DELAY = 500; // ms

const simulateNetwork = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Deep copy to prevent direct mutation of the "database"
      resolve(JSON.parse(JSON.stringify(data)));
    }, NETWORK_DELAY);
  });
};

const apiService = {
  // --- GET ---
  getProducts: () => simulateNetwork(db.db_getProducts()),
  getCategories: () => simulateNetwork(db.db_getCategories()),
  getSellers: () => simulateNetwork(db.db_getSellers()),
  getArticles: () => simulateNetwork(db.db_getArticles()),
  getPosts: () => simulateNetwork(db.db_getPosts()),
  getReviews: () => simulateNetwork(db.db_getReviews()),
  getOrders: () => simulateNetwork(db.db_getOrders()),
  getLiveSessions: () => simulateNetwork(db.db_getLiveSessions()),
  getConversations: () => simulateNetwork(db.db_getConversations()),
  getInfluencers: () => simulateNetwork(db.db_getInfluencers()),
  getPromotions: () => simulateNetwork(db.db_getPromotions()),
  getFinancialTransactions: () => simulateNetwork(db.db_getFinancialTransactions()),

  // --- MUTATIONS ---
  addProduct: (productData: Omit<Product, '_id' | 'status'>) => simulateNetwork(db.db_addProduct(productData)),
  
  addArticle: (articleData: Omit<Article, '_id'>) => simulateNetwork(db.db_addArticle(articleData)),
  
  addReview: (reviewData: Omit<Review, '_id'>) => simulateNetwork(db.db_addReview(reviewData)),

  addOrder: (orderData: Omit<Order, '_id'>) => simulateNetwork(db.db_addOrder(orderData)),

  updateOrderStatus: (orderId: string, status: Order['status']) => simulateNetwork(db.db_updateOrderStatus(orderId, status)),

  addPost: (postData: Omit<Post, '_id' | 'likes' | 'comments' | 'timestamp'>) => simulateNetwork(db.db_addPost(postData)),
  
  addComment: (postId: string, commentData: Omit<Comment, '_id'>) => simulateNetwork(db.db_addComment(postId, commentData)),

  addLiveSession: (sessionData: Omit<LiveSession, '_id' | 'status' | 'start_time' | 'end_time' | 'google_calendar_event_id' | 'google_meet_link'>) => simulateNetwork(db.db_addLiveSession(sessionData)),
  
  addPromotion: (promoData: Omit<Promotion, '_id' | 'status'>) => simulateNetwork(db.db_addPromotion(promoData)),

  updateSellerDetails: (sellerId: string, details: Partial<Seller>) => simulateNetwork(db.db_updateSellerDetails(sellerId, details)),
};

export default apiService;