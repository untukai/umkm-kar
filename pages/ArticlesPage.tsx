import React, { useState } from 'react';
import ArticleCard from '../components/ArticleCard';
import Button from '../components/Button';
import Input from '../components/Input';
import { generateArticle } from '../services/geminiService';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';

const ArticlesPage: React.FC = () => {
  const { articles, addArticle, isLoading: isAppLoading } = useAppData();
  const { user } = useAuth(); // To get author name
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Topik tidak boleh kosong.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);

    try {
      const newArticleData = await generateArticle(topic);
      await addArticle(newArticleData, user?.name || 'Tim KODIK');
      setTopic(''); // Clear input after success
    } catch (err) {
      console.error(err);
      setError('Gagal membuat artikel. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-10">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center">Inspirasi Lokal Karawang</h1>
        <p className="text-center text-neutral-600 mt-2 max-w-2xl mx-auto">
          Temukan cerita, inovasi, dan potensi UMKM di Karawang melalui artikel-artikel pilihan kami.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg border border-primary/20">
        <h2 className="text-xl font-bold mb-4">Buat Artikel Baru dengan Bantuan AI</h2>
        <form onSubmit={handleGenerateArticle} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-neutral-700 mb-1">
              Masukkan Topik Artikel
            </label>
            <Input 
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Kisah sukses pengrajin batik Karawang"
              disabled={isGenerating}
            />
          </div>
          <Button type="submit" disabled={isGenerating} className="w-full sm:w-auto">
            {isGenerating ? 'Sedang Membuat...' : 'Buat Artikel'}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Semua Artikel</h2>
        {isAppLoading ? (
            <p className="text-neutral-500">Memuat artikel...</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
