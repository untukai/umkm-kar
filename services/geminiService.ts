import { Product, Article } from '../types';

/**
 * Fitur rekomendasi AI dinonaktifkan.
 * Fungsi ini sekarang mengembalikan array kosong sebagai placeholder.
 */
export const getAIRecommendations = async (query: string, products: Product[]): Promise<string[]> => {
  console.warn("Fitur AI dinonaktifkan. getAIRecommendations mengembalikan data kosong.");
  // Mengembalikan array kosong karena fitur dinonaktifkan
  return Promise.resolve([]);
};

/**
 * Fitur pembuatan deskripsi AI dinonaktifkan.
 * Fungsi ini sekarang mengembalikan deskripsi asli produk.
 */
export const generateProductDescription = async (product: Product): Promise<string> => {
  console.warn("Fitur AI dinonaktifkan. generateProductDescription mengembalikan deskripsi asli.");
  // Mengembalikan deskripsi yang ada sebagai fallback
  return Promise.resolve(product.description);
};

/**
 * Fitur pembuatan artikel AI dinonaktifkan.
 * Fungsi ini sekarang akan melempar error untuk menandakan bahwa fitur tidak tersedia.
 */
export const generateArticle = async (topic: string): Promise<Omit<Article, 'id'>> => {
  console.error("Fitur AI dinonaktifkan. generateArticle tidak dapat digunakan.");
  // Melempar error karena fitur ini tidak memiliki fallback yang wajar
  throw new Error("Fitur pembuatan artikel dengan AI saat ini dinonaktifkan.");
};
