import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Calendar, Clock, Eye, Share2, Check, Tag, ArrowLeft } from 'lucide-react';
import { BlogPost } from '../types/blog';

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSelectTag?: (tag: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ post, onClose, onSelectTag }) => {
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const formatDate = (dateVal: any) => {
    try {
      if (!dateVal) return 'RECENT';
      if (dateVal.toDate && typeof dateVal.toDate === 'function') {
        return dateVal.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      const d = new Date(dateVal);
      return isNaN(d.getTime())
        ? 'RECENT'
        : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return 'RECENT';
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#050505]/90 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/20 shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Header Action Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#050505]/80 backdrop-blur-sm sticky top-0 z-10">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-stone-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={16} />
              <span>RETURN TO NEXUS</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-fuchsia-500 text-stone-300 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all"
                title="Share link"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                <span>{copied ? 'COPIED' : 'SHARE'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-stone-500 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Scrollable Article Body */}
          <div className="overflow-y-auto p-6 md:p-12 space-y-8">
            {/* Article Meta Top */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-fuchsia-500 text-black text-[10px] font-black uppercase tracking-widest">
                  {post.category || 'UNDERGROUND'}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-widest">
                  <Calendar size={13} />
                  {formatDate(post.createdAt)}
                </span>
                <span className="text-stone-700">•</span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-widest">
                  <Clock size={13} />
                  {post.readTimeMinutes || 4} MIN READ
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
                {post.title}
              </h1>

              {/* Author Banner */}
              <div className="flex items-center gap-4 py-4 border-y border-white/10">
                {post.author?.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-10 h-10 bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center font-black text-fuchsia-400">
                    {post.author?.name ? post.author.name.charAt(0) : 'T'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                    {post.author?.name || 'TEAMTHEE ARCHITECT'}
                  </div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-widest">
                    {post.author?.role || 'UNDERGROUND RESEARCHER'}
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative w-full max-h-[420px] overflow-hidden border border-white/15">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Markdown Content */}
            <div className="prose-cyberpunk text-base">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match && !String(children).includes('\n');
                    return isInline ? (
                      <code className="bg-[#171717] text-fuchsia-300 px-1.5 py-0.5 text-xs font-mono border border-white/10" {...props}>
                        {children}
                      </code>
                    ) : (
                      <div className="relative my-4 group">
                        <div className="flex items-center justify-between bg-[#141414] px-4 py-1.5 border border-white/10 border-b-0 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                          <span>{match ? match[1] : 'TERMINAL'}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(String(children));
                            }}
                            className="hover:text-fuchsia-400 transition-colors"
                          >
                            COPY
                          </button>
                        </div>
                        <pre className="!mt-0 !bg-[#0a0a0a] !border-white/10 text-xs font-mono p-4 overflow-x-auto">
                          <code {...props}>{children}</code>
                        </pre>
                      </div>
                    );
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags section */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest flex items-center gap-1 mr-2">
                  <Tag size={12} />
                  INDEXED TAGS:
                </span>
                {post.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (onSelectTag) {
                        onSelectTag(tag);
                        onClose();
                      }
                    }}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 text-stone-400 hover:text-fuchsia-300 text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

