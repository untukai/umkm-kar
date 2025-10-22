
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articles as dummyArticles } from '../data/dummyData';
import { Article } from '../types';
import { generateArticle } from '../services/geminiService';
import Button from '../components/Button';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const storedArticles = localStorage.getItem('kodik-articles');
      if (storedArticles) {
        setArticles(JSON.parse(storedArticles));
      } else {
        setArticles(dummyArticles);
      }
    } catch (e) {
      console.error("Failed to parse articles from localStorage", e);
      setArticles(dummyArticles);
    }
  }, []);

  const handleGenerateArticle = async () => {
    if (!topic.trim()) {
      setError('Topik tidak boleh kosong.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const generatedData = await generateArticle(topic);
      const newArticle: Article = {
        id: Date.now(),
        ...generatedData,
      };
      
      const updatedArticles = [newArticle, ...articles];
      setArticles(updatedArticles);
      localStorage.setItem('kodik-articles', JSON.stringify(updatedArticles));
      
      setIsModalOpen(false);
      setTopic('');
    } catch (e) {
      setError('Gagal membuat artikel. Coba lagi nanti.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Artikel Lokal Karawang</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Jelajahi cerita, inovasi, dan budaya di balik produk-produk UMKM Karawang yang luar biasa.
        </p>
        <Button onClick={() => setIsModalOpen(true)} className="mt-6 !font-bold">
          ✨ Buat Artikel Baru dengan AI
        </Button>
      </div>

      <div className="space-y-8">
        {articles.map(article => (
          <div key={article.id} className="flex flex-col md:flex-row items-start gap-6 border-b pb-8 last:border-b-0">
            <div className="w-full md:w-1/3 h-48 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                <span className="text-neutral-500">Gambar Artikel</span>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-800">{article.title}</h2>
              <p className="text-gray-600 mt-2">{article.summary}</p>
              <Link to={`/articles/${article.id}`}>
                <Button className="mt-4" variant="outline">Baca Selengkapnya</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-2">Buat Artikel dengan AI</h2>
                <p className="text-neutral-600 mb-4">Masukkan topik atau kata kunci, dan biarkan AI menulis artikel untuk Anda. Contoh: "Kisah sukses pengrajin anyaman bambu".</p>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-2 border rounded-md h-24 focus:ring-primary focus:border-primary"
                    placeholder="Masukkan topik di sini..."
                    disabled={isLoading}
                />
                <div className="flex justify-end gap-4 mt-4">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isLoading}>Batal</Button>
                    <Button onClick={handleGenerateArticle} disabled={isLoading}>
                        {isLoading ? 'Membuat Artikel...' : 'Buat Sekarang'}
                    </Button>
                </div>
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;