
import React, { useState } from 'react';
import PostCard from '../components/PostCard';
import { posts as initialPosts, addPost, sellers } from '../data/dummyData';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { Post } from '../types';

const CreatePostForm: React.FC<{ onAddPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>) => void }> = ({ onAddPost }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');

    const currentSeller = sellers.find(s => s.email === user?.email);

    if (!currentSeller) {
        return null; // Don't show form if not a seller
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        onAddPost({
            sellerId: currentSeller.id,
            content: content,
        });
        setContent('');
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-bold mb-3">Buat Postingan Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Apa yang Anda pikirkan, ${currentSeller.name}?`}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
                <div className="text-right">
                    <Button type="submit">Posting</Button>
                </div>
            </form>
        </div>
    );
};


const FeedPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);

    const handleAddPost = (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
        addPost(post);
        // This is a hack to re-render. In a real app with a state manager, this would be automatic.
        setPosts([...initialPosts]); 
    };

  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Kabar Penjual</h1>
        <CreatePostForm onAddPost={handleAddPost} />
        <div className="space-y-6">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    </div>
  );
};

export default FeedPage;
