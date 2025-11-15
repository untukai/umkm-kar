

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/dummyData';
import Button from '../components/Button';
import { useNotification } from '../hooks/useNotification';
import { ShareIcon, TwitterIcon, LinkedInIcon } from '../components/Icons';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  
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

  const handleShare = (platform: 'copy' | 'twitter' | 'linkedin') => {
    const articleUrl = window.location.href;
    const articleTitle = article.title;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(articleUrl).then(() => {
        showNotification('Berhasil Disalin', 'Tautan artikel berhasil disalin!');
      });
      return;
    }
    
    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}&summary=${encodeURIComponent(article.summary)}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="w-full h-64 md:h-80 bg-neutral-200 rounded-lg mb-6 flex items-center justify-center">
        <span className="text-neutral-500">Gambar Artikel</span>
      </div>
      
      <div className="mb-4 text-sm text-neutral-500">
        <span>Oleh <strong className="text-neutral-700">{article.author}</strong></span>
        <span className="mx-2">|</span>
        <span>Diterbitkan pada {formatDate(article.publishDate)}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">{article.title}</h1>
      <p className="text-lg text-neutral-600 mt-4 italic border-l-4 border-primary pl-4">{article.summary}</p>
      
      <div className="border-t my-8"></div>

      <div className="prose max-w-none text-neutral-800 leading-relaxed whitespace-pre-wrap">
        {article.content}
      </div>
      
      <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold">Bagikan:</span>
          <button onClick={() => handleShare('copy')} className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors" title="Salin Tautan">
            <ShareIcon className="w-5 h-5 text-neutral-600" />
          </button>
          <button onClick={() => handleShare('twitter')} className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors" title="Bagikan ke Twitter">
            <TwitterIcon className="w-5 h-5 text-[#1DA1F2]" />
          </button>
          <button onClick={() => handleShare('linkedin')} className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors" title="Bagikan ke LinkedIn">
            <LinkedInIcon className="w-5 h-5 text-[#0A66C2]" />
          </button>
        </div>
        <Link to="/articles">
          <Button variant="outline">Kembali ke Semua Artikel</Button>
        </Link>
      </div>
    </div>
  );
};

export default ArticleDetailPage;