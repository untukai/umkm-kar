
import React, { useState } from 'react';
import { Post, Comment } from '../types';
import { sellers } from '../data/dummyData';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import Input from './Input';
import { ThumbUpIcon, ChatBubbleIcon, StoreIcon, UserIcon } from './Icons';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post: initialPost }) => {
    const { user } = useAuth();
    const [post, setPost] = useState(initialPost);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const seller = sellers.find(s => s.id === post.sellerId);

    const timeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return "Baru saja";
    };

    const handleLike = () => {
        setPost(prevPost => ({
            ...prevPost,
            likes: isLiked ? prevPost.likes - 1 : prevPost.likes + 1,
        }));
        setIsLiked(!isLiked);
    };
    
    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        const comment: Comment = {
            id: Date.now(),
            userName: user.email.split('@')[0],
            userEmail: user.email,
            text: newComment,
        };
        
        setPost(prevPost => ({
            ...prevPost,
            comments: [...prevPost.comments, comment],
        }));
        setNewComment('');
    };

    if (!seller) return null;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <StoreIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-bold text-neutral-800">{seller.name}</p>
                        <p className="text-xs text-neutral-500">{timeAgo(post.timestamp)}</p>
                    </div>
                </div>
                <p className="text-neutral-700 whitespace-pre-wrap">{post.content}</p>
            </div>
            
            {post.imageUrl && (
                <div className="w-full bg-neutral-100">
                    <img src={post.imageUrl} alt="Post content" className="w-full h-auto max-h-96 object-contain" />
                </div>
            )}
            
            <div className="p-4">
                <div className="flex justify-between text-sm text-neutral-600">
                    <span>{post.likes} Suka</span>
                    <span>{post.comments.length} Komentar</span>
                </div>
                <div className="border-t my-2"></div>
                <div className="grid grid-cols-2 gap-1">
                    <button onClick={handleLike} className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors font-semibold ${isLiked ? 'text-primary bg-primary/10' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                        <ThumbUpIcon className="w-5 h-5" />
                        <span>Suka</span>
                    </button>
                    <button onClick={() => setShowComments(!showComments)} className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 font-semibold">
                        <ChatBubbleIcon className="w-5 h-5" />
                        <span>Komentar</span>
                    </button>
                </div>
            </div>
            
            {showComments && (
                <div className="p-4 border-t bg-neutral-50 animate-fade-in">
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {post.comments.map(comment => (
                             <div key={comment.id} className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                                    <UserIcon className="w-5 h-5 text-neutral-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{comment.userName}</p>
                                    <p className="text-sm bg-neutral-200 p-2 rounded-lg mt-1 inline-block">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                         {post.comments.length === 0 && <p className="text-sm text-neutral-500 text-center">Belum ada komentar.</p>}
                    </div>
                    {user && (
                         <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center gap-2">
                            <Input 
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Tulis komentar..."
                                className="flex-1"
                            />
                            <Button type="submit" disabled={!newComment.trim()}>Kirim</Button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;
