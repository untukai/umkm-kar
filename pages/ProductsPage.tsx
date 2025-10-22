
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/dummyData';
import { Product } from '../types';
import { getAIRecommendations } from '../services/geminiService';
import Button from '../components/Button';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOrder, setSortOrder] = useState('terbaru');
  
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiRecommendedNames, setAiRecommendedNames] = useState<string[]>([]);
  const [aiError, setAiError] = useState('');

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';
    const sellerId = searchParams.get('seller');

    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
    }
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase().replace(/\s/g, '-') === category);
    }
    if (sellerId) {
      filtered = filtered.filter(p => p.sellerId === parseInt(sellerId));
    }
    
    if (aiRecommendedNames.length > 0) {
        filtered = filtered.filter(p => aiRecommendedNames.includes(p.name));
    }

    switch (sortOrder) {
      case 'termurah':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'termahal':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'terbaru':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }
    return filtered;
  }, [searchParams, sortOrder, aiRecommendedNames]);

  const handleCategoryChange = (categoryId: string) => {
    setSearchParams(prev => {
      if (categoryId) {
        prev.set('category', categoryId);
      } else {
        prev.delete('category');
      }
      prev.delete('seller'); // Clear seller filter when changing category
      return prev;
    });
  };
  
  const handleAiSearch = async () => {
    if (!aiQuery) return;
    setIsLoadingAi(true);
    setAiError('');
    setAiRecommendedNames([]);
    try {
        const recommendations = await getAIRecommendations(aiQuery, products);
        setAiRecommendedNames(recommendations);
    } catch (error) {
        setAiError('Gagal mendapatkan rekomendasi. Silakan coba lagi.');
        console.error(error);
    } finally {
        setIsLoadingAi(false);
        setIsAiModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <div className="bg-white p-4 rounded-lg shadow-sm sticky top-24">
          <h3 className="font-bold text-lg mb-4 border-b pb-2">Kategori</h3>
          <ul className="space-y-1">
            <li>
              <button onClick={() => handleCategoryChange('')} className={`w-full text-left p-2 rounded-md transition-colors text-sm ${!searchParams.get('category') ? 'text-white bg-primary font-semibold' : 'text-neutral-700 hover:bg-neutral-100'}`}>Semua Kategori</button>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <button onClick={() => handleCategoryChange(cat.id.toLowerCase().replace(/\s/g, '-'))} className={`w-full text-left p-2 rounded-md transition-colors text-sm ${searchParams.get('category') === cat.id.toLowerCase().replace(/\s/g, '-') ? 'text-white bg-primary font-semibold' : 'text-neutral-700 hover:bg-neutral-100'}`}>{cat.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="w-full md:w-3/4 lg:w-4/5">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Produk UMKM Karawang</h1>
            <p className="text-neutral-500 text-sm">{filteredProducts.length} produk ditemukan</p>
          </div>
          <div className="flex items-center gap-4">
             <Button onClick={() => setIsAiModalOpen(true)} variant="outline">✨ Asisten AI</Button>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="border border-neutral-300 rounded-lg p-2 text-sm focus:ring-primary focus:border-primary">
              <option value="terbaru">Urutkan: Terbaru</option>
              <option value="termurah">Urutkan: Termurah</option>
              <option value="termahal">Urutkan: Termahal</option>
            </select>
          </div>
        </div>
        
        {aiRecommendedNames.length > 0 && (
            <div className="bg-primary/10 border-l-4 border-primary text-primary-dark p-4 mb-6 rounded-md shadow-sm" role="alert">
                <p className="font-bold">Hasil Rekomendasi AI</p>
                <p>Menampilkan produk yang paling sesuai untuk: "{aiQuery}"</p>
                <button onClick={() => { setAiRecommendedNames([]); setAiQuery('') }} className="text-sm underline mt-2 font-semibold">Hapus Filter AI</button>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => <ProductCard key={product.id} product={product} />)
          ) : (
            <p className="col-span-full text-center text-neutral-500 py-12">Produk tidak ditemukan.</p>
          )}
        </div>
      </main>
      
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2">Asisten Belanja AI</h2>
                <p className="text-neutral-600 mb-4">Jelaskan produk yang Anda cari, misal "camilan pedas" atau "hadiah unik buatan tangan".</p>
                <textarea
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="w-full p-2 border rounded-md h-24 focus:ring-primary focus:border-primary"
                    placeholder="Saya mencari..."
                />
                <div className="flex justify-end gap-4 mt-4">
                    <Button variant="secondary" onClick={() => setIsAiModalOpen(false)}>Batal</Button>
                    <Button onClick={handleAiSearch} disabled={isLoadingAi}>
                        {isLoadingAi ? 'Mencari...' : 'Cari dengan AI'}
                    </Button>
                </div>
                {aiError && <p className="text-red-500 mt-2 text-sm">{aiError}</p>}
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;