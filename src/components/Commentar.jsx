import { useState, useEffect, useRef, useCallback, memo } from 'react';
import PropTypes from "prop-types";
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';


const Comment = memo(({ comment, formatDate, isPinned = false }) => (
    <div 
        className={`rounded-xl border p-4 transition-colors duration-200 ${
            isPinned 
                ? 'border-[var(--accent)]/30 bg-[var(--accent-soft)]'
                : 'border-[var(--line)] bg-[var(--surface-raised)]'
        }`}
    >
        {isPinned && (
            <div className="flex items-center gap-2 mb-3 text-[var(--accent)]">
                <Pin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Pinned Comment</span>
            </div>
        )}
        <div className="flex items-start gap-3">
            {comment.profile_image ? (
                <img
                    src={comment.profile_image}
                    alt={`${comment.user_name}'s profile`}
                    className={`w-10 h-10 rounded-full object-cover border-2 flex-shrink-0  ${
                        isPinned ? 'border-indigo-500/50' : 'border-indigo-500/30'
                    }`}
                    loading="lazy"
                />
            ) : (
                <div className={`p-2 rounded-full text-[var(--accent)] ${
                    isPinned ? 'bg-[var(--accent-soft)]' : 'bg-[var(--surface)]'
                }`}>
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-medium truncate ${
                            isPinned ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                        }`}>
                            {comment.user_name}
                        </h4>
                        {isPinned && (
                            <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                                Admin
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-[var(--muted)] whitespace-nowrap">
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                <p className="text-[var(--muted)] text-sm break-words leading-relaxed">
                    {comment.content}
                </p>
            </div>
        </div>
    </div>
));
Comment.displayName = "Comment";
Comment.propTypes = {
    comment: PropTypes.shape({
        profile_image: PropTypes.string,
        user_name: PropTypes.string.isRequired,
        created_at: PropTypes.string,
        content: PropTypes.string.isRequired,
    }).isRequired,
    formatDate: PropTypes.func.isRequired,
    isPinned: PropTypes.bool,
};

const CommentForm = memo(({ onSubmit, isSubmitting }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB. Please choose a smaller image.');
                // Reset the input
                if (e.target) e.target.value = '';
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                if (e.target) e.target.value = '';
                return;
            }
            
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;
        
        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setUserName('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-semibold text-[var(--text)]">
                    Name <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                     maxLength={15}
                    placeholder="Enter your name"
                    className="min-h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--text)] placeholder:text-[var(--muted)] outline-none transition-colors duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-semibold text-[var(--text)]">
                    Message <span className="text-[var(--accent)]">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                     maxLength={200}

                    onChange={handleTextareaChange}
                    placeholder="Write your message here..."
                    className="min-h-32 w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-[var(--text)] placeholder:text-[var(--muted)] outline-none transition-colors duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-semibold text-[var(--text)]">
                    Profile Photo <span className="font-normal text-[var(--muted)]">(optional)</span>
                </label>
                <div className="flex min-h-20 items-center gap-4 rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-4">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 text-sm font-medium text-[var(--accent)] transition-colors duration-200 hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                            >
                                <ImagePlus className="h-5 w-5" aria-hidden="true" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="mt-2 text-center text-xs text-[var(--muted)]">
                                Max file size: 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--accent-dark)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
                <span className="flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </span>
            </button>
        </form>
    );
});
CommentForm.displayName = "CommentForm";
CommentForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            once: false,
            duration: 250,
        });
    }, []);

    // Fetch pinned comment
    useEffect(() => {
        const fetchPinnedComment = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolio_comments')
                    .select('*')
                    .eq('is_pinned', true)
                    .maybeSingle();
                
                if (error) {
                    console.error('Error fetching pinned comment:', error);
                    return;
                }
                
                if (data) {
                    setPinnedComment(data);
                }
            } catch (error) {
                console.error('Error fetching pinned comment:', error);
            }
        };

        fetchPinnedComment();
    }, []);

    // Fetch regular comments (excluding pinned) and set up real-time subscription
    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('portfolio_comments')
                .select('*')
                .eq('is_pinned', false)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error fetching comments:', error);
                return;
            }
            
            setComments(data || []);
        };

        fetchComments();

        // Set up real-time subscription
        const subscription = supabase
            .channel('portfolio_comments')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'portfolio_comments',
                    filter: 'is_pinned=eq.false'
                }, 
                () => {
                    fetchComments(); // Refresh comments when changes occur
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('profile-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);
        
        try {
            const profileImageUrl = await uploadImage(imageFile);
            
            const { error } = await supabase
                .from('portfolio_comments')
                .insert([
                    {
                        content: newComment,
                        user_name: userName,
                        profile_image: profileImageUrl,
                        is_pinned: false,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                throw error;
            }
        } catch (error) {
            setError('Failed to post comment. Please try again.');
            console.error('Error adding comment: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, []);

    // Calculate total comments (pinned + regular)
    const totalComments = comments.length + (pinnedComment ? 1 : 0);

    return (
        <div className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] shadow-[var(--shadow-card)]" data-aos="fade-up" data-aos-duration="250">
            <div className="border-b border-[var(--line)] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
                        <MessageCircle className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-[var(--text)]">Community Comments</h3>
                        <p className="text-sm text-[var(--muted)]">{totalComments} contributions</p>
                    </div>
                </div>
            </div>
            <div className="p-5 sm:p-6">
                {error && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700" data-aos="fade-in">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)]">
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink)] p-5">
                        <h4 className="mb-5 text-base font-semibold text-[var(--text)]">Leave a comment</h4>
                        <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} />
                    </div>
                    <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1 custom-scrollbar" data-aos="fade-up" data-aos-delay="100">
                    {/* Pinned Comment */}
                    {pinnedComment && (
                        <div data-aos="fade-down" data-aos-duration="800">
                            <Comment 
                                comment={pinnedComment} 
                                formatDate={formatDate}
                                isPinned={true}
                            />
                        </div>
                    )}
                    
                    {/* Regular Comments */}
                    {comments.length === 0 && !pinnedComment ? (
                        <div className="text-center py-8" data-aos="fade-in">
                            <UserCircle2 className="mx-auto mb-3 h-12 w-12 text-[var(--muted)]" />
                            <p className="text-sm text-[var(--muted)]">No comments yet. Start the conversation!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <Comment 
                                key={comment.id} 
                                comment={comment} 
                                formatDate={formatDate}
                                isPinned={false}
                            />
                        ))
                    )}
                </div>
            </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.5);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.7);
                }
            `}</style>
        </div>
    );
};

export default Komentar;