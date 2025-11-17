

import React, { useState, useEffect } from 'react';
import { Post, Comment } from '../types';
// FIX: Remove import from deprecated dummyData.ts
import { useAuth } from '../hooks/useAuth';
import { HeartIcon, ChatBubbleIcon, StoreIcon, ShareIcon } from './Icons';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useNotification } from '../hooks/useNotification';
// FIX: Import useAppData to get data from the context
import { useAppData } from '../hooks/useAppData';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post: initialPost }) => {
    const { user, isAuthenticated } = useAuth();
    const { showNotification } = useNotification();
    // FIX: Get sellers and addComment function from AppDataContext
    const { sellers, addComment } = useAppData();

    // NOTE: This component uses local state derived from props. This works here because
    // the parent component (FeedPage) uses a `key` on PostCard, causing it to
    // remount with new initial state when props change.
    const [post, setPost] = useState(initialPost);
    const [comments, setComments] = useState<Comment[]>(initialPost.comments);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    
    // FIX: Sync local state if the prop changes without a remount (e.g., after adding a comment).
    useEffect(() => {
        setPost(initialPost);
        setComments(initialPost.comments);
    }, [initialPost]);

    const seller = sellers.find(s => s._id === post.sellerId);

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
    
    const showLoginNotification = () => {
        showNotification(
            'Login Diperlukan',
            'Anda harus masuk untuk menyukai atau mengomentari postingan.',
            'error',
            { label: 'Masuk Sekarang', path: '/login' }
        );
    };

    const handleLike = () => {
        if (!isAuthenticated) {
            showLoginNotification();
            return;
        }
        setPost(prevPost => ({
            ...prevPost,
            likes: isLiked ? prevPost.likes - 1 : prevPost.likes + 1,
        }));
        setIsLiked(!isLiked);
    };

    const handleToggleComments = () => {
        if (!isAuthenticated) {
            showLoginNotification();
            return;
        }
        setShowComments(!showComments);
    };
    
    const handleSetReplyTo = (commentId: string) => {
        if (!isAuthenticated) {
            showLoginNotification();
            return;
        }
        setReplyingTo(commentId);
    };

    const handleShare = () => {
        const postUrl = `${window.location.origin}${window.location.pathname}#/feed`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(postUrl).then(() => {
                showNotification('Berhasil Disalin', 'Tautan ke Feed berhasil disalin!');
            });
        } else {
            showNotification('Gagal', 'Gagal menyalin tautan.', 'error');
        }
    };
    
    const handleCommentSubmit = async (text: string, parentId: string | null = null) => {
        if (!user) {
            showLoginNotification();
            return;
        }

        const newCommentData: Omit<Comment, '_id'> = {
            parentId: parentId || undefined,
            // FIX: Use user.name for consistency across the app
            userName: user.name,
            userEmail: user.email,
            text: text,
        };

        // FIX: Call the async addComment from context with the correct string-based post ID.
        // The global state update will trigger a re-render of this component with new props.
        await addComment(post._id, newCommentData);
        
        setReplyingTo(null);
    };

    if (!seller) return null;

    const topLevelComments = comments.filter(c => !c.parentId);

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
                    <span>{comments.length} Komentar</span>
                </div>
                <div className="border-t my-2"></div>
                <div className="grid grid-cols-3 gap-1">
                    <button onClick={handleLike} className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors font-semibold ${isLiked ? 'text-red-500 bg-red-50' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                        <HeartIcon className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
                        <span>Suka</span>
                    </button>
                    <button onClick={handleToggleComments} className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 font-semibold">
                        <ChatBubbleIcon className="w-5 h-5" />
                        <span>Komentar</span>
                    </button>
                     <button onClick={handleShare} className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 font-semibold transition-colors">
                        <ShareIcon className="w-5 h-5" />
                        <span>Bagikan</span>
                    </button>
                </div>
            </div>
            
            {showComments && (
                <div className="p-4 border-t bg-neutral-50 animate-fade-in">
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {topLevelComments.length > 0 ? (
                            topLevelComments.map(comment => (
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    allComments={comments}
                                    onReply={handleSetReplyTo}
                                    activeReplyId={replyingTo}
                                    onSubmitReply={handleCommentSubmit}
                                    onCancelReply={() => setReplyingTo(null)}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-neutral-500 text-center py-4">Jadilah yang pertama berkomentar.</p>
                        )}
                    </div>
                    {isAuthenticated && (
                         <CommentForm 
                            onSubmit={(text) => handleCommentSubmit(text, null)}
                            placeholder="Tulis komentar publik..."
                         />
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;