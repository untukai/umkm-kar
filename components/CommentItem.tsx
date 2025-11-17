import React from 'react';
import { Comment } from '../types';
import { UserIcon } from './Icons';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  onReply: (commentId: string) => void;
  activeReplyId: string | null;
  onSubmitReply: (text: string, parentId: string) => void;
  onCancelReply: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  allComments,
  onReply,
  activeReplyId,
  onSubmitReply,
  onCancelReply,
}) => {
  const replies = allComments.filter(c => c.parentId === comment._id);
  const isReplying = activeReplyId === comment._id;

  const handleReplySubmit = (text: string) => {
    onSubmitReply(text, comment._id);
  };

  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
        <UserIcon className="w-5 h-5 text-neutral-500" />
      </div>
      <div className="flex-1">
        <div className="bg-neutral-100 p-2 rounded-lg">
          <p className="font-semibold text-sm text-neutral-800">{comment.userName}</p>
          <p className="text-sm text-neutral-700">{comment.text}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
          <button onClick={() => onReply(comment._id)} className="font-semibold hover:underline">Balas</button>
        </div>
        
        {isReplying && (
          <div>
            <CommentForm
              onSubmit={handleReplySubmit}
              placeholder={`Membalas ${comment.userName}...`}
              buttonLabel="Balas"
              autoFocus
            />
            <button onClick={onCancelReply} className="text-xs text-neutral-500 hover:underline mt-1 ml-12">Batal</button>
          </div>
        )}
        
        {replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {replies.map(reply => (
              <CommentItem
                key={reply._id}
                comment={reply}
                allComments={allComments}
                onReply={onReply}
                activeReplyId={activeReplyId}
                onSubmitReply={onSubmitReply}
                onCancelReply={onCancelReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
