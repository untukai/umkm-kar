
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/dummyData';
import Button from '../components/Button';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, you might fetch this from localStorage or an API
  const article = articles.find(a => a.id === parseInt(id || ''));

  if (!article) {
    return (
      <div className="text-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">Artikel tidak ditemukan</h1>
        <Link to="/articles" className="text-primary hover:underline mt-4 inline-block">
          <Button>Kembali ke Halaman Artikel</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="w-full h-64 md:h-80 bg-neutral-200 rounded-lg mb-6 flex items-center justify-center">
        <span className="text-neutral-500">Gambar Artikel</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">{article.title}</h1>
      <p className="text-lg text-neutral-600 mt-4 italic border-l-4 border-primary pl-4">{article.summary}</p>
      
      <div className="border-t my-8"></div>

      <div className="prose max-w-none text-neutral-800 leading-relaxed whitespace-pre-wrap">
        {article.content}
      </div>
      
      <div className="mt-10 text-center">
        <Link to="/articles">
          <Button variant="outline">Kembali ke Semua Artikel</Button>
        </Link>
      </div>
    </div>
  );
};

export default ArticleDetailPage;