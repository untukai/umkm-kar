

import React, { useState } from 'react';
import { Post, Comment } from '../types';
// FIX: Import `posts` as `initialPosts` to access the global posts array.
import { sellers, addComment, posts as initialPosts } from '../data/dummyData';
import { useAuth } from '../hooks/useAuth';
import { HeartIcon, ChatBubbleIcon, StoreIcon, ShareIcon } from './Icons';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useNotification } from '../hooks/useNotification';
import { useShare } from '../hooks/useShare';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post: initialPost }) => {
    const { user, isAuthenticated } = useAuth();
    const { showNotification } = useNotification();
    const { showShareModal } = useShare();
    const [post, setPost] = useState(initialPost);
    const [comments, setComments] = useState<Comment[]>(initialPost.comments);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

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
    
    const handleSetReplyTo = (commentId: number) => {
        if (!isAuthenticated) {
            showLoginNotification();
            return;
        }
        setReplyingTo(commentId);
    };

    const handleShare = async () => {
        if (!seller) return;
        const postUrl = `${window.location.origin}${window.location.pathname}#/feed`;
        const shareData = {
          title: `Postingan dari ${seller.name} di KODIK`,
          text: `Cek postingan menarik dari ${seller.name} di KODIK Feed!`,
          url: postUrl,
        };
    
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (error) {
            if (error instanceof DOMException && error.name !== 'AbortError') {
              console.error('Error sharing natively:', error);
              showShareModal(shareData);
            }
          }
        } else {
          showShareModal(shareData);
        }
    };
    
    const handleCommentSubmit = (text: string, parentId: number | null = null) => {
        if (!user) {
            showLoginNotification();
            return;
        }

        const newCommentData: Omit<Comment, 'id'> = {
            parentId: parentId || undefined,
            userName: user.email.split('@')[0],
            userEmail: user.email,
            text: text,
        };

        addComment(post.id, newCommentData);

        // FIX: Use `initialPosts` (the imported global `posts` array) to get the updated comments.
        const updatedPostComments = initialPosts.find(p => p.id === post.id)!.comments;
        const addedComment = updatedPostComments[updatedPostComments.length - 1];
        
        setComments(prev => [...prev, addedComment]);
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
            
            {post.mediaUrl && (
                <div className="w-full bg-black flex items-center justify-center">
                    {post.mediaType === 'video' ? (
                        <video src={post.mediaUrl} controls className="w-full max-h-96" />
                    ) : (
                        <img src={post.mediaUrl} alt="Post content" className="w-full h-auto max-h-96 object-contain" />
                    )}
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
                                    key={comment.id}
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