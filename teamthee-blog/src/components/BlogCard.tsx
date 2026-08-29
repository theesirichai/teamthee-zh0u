import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Edit3, ArrowUpRight, Flame } from 'lucide-react';
import { BlogPost, AdminUser } from '../types/blog';

interface BlogCardProps {
  post: BlogPost;
  adminUser: AdminUser;
  onSelectPost: (post: BlogPost) => void;
  onEditPost?: (post: BlogPost) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  adminUser,
  onSelectPost,
  onEditPost
}) => {
  const formatDate = (dateVal: any) => {
    try {
      if (!dateVal) return 'RECENT';
      // Firestore timestamp support
      if (dateVal.toDate && typeof dateVal.toDate === 'function') {
        return dateVal.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      const d = new Date(dateVal);
      return isNaN(d.getTime())
        ? 'RECENT'
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'RECENT';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-[#0a0a0a] border border-white/10 hover:border-fuchsia-500/60 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onSelectPost(post)}
    >
      {/* Cover Image Banner */}
      {post.coverImage ? (
        <div className="relative w-full h-48 overflow-hidden bg-stone-900 border-b border-white/10">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
            onError={(e) => {
              // fallback image if broken link
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/20 text-[9px] font-black uppercase tracking-widest text-fuchsia-400">
              {post.category || 'UNDERGROUND'}
            </span>
            {post.featured && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-fuchsia-500 text-black text-[9px] font-black uppercase tracking-widest">
                <Flame size={10} fill="currentColor" />
                FEATURED
              </span>
            )}
            {!post.published && (
              <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest">
                DRAFT
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-fuchsia-400">
            {post.category || 'UNDERGROUND'}
          </span>
          {post.featured && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-fuchsia-500 text-black text-[9px] font-black uppercase tracking-widest">
              <Flame size={10} fill="currentColor" />
              FEATURED
            </span>
          )}
        </div>
      )}

      {/* Content Body */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Metadata info */}
          <div className="flex items-center gap-3 text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-3">
            <span className="flex items-center gap-1">
              <Calendar size={11} className="text-stone-600" />
              {formatDate(post.createdAt)}
            </span>
            <span className="w-1 h-1 bg-stone-700 rounded-full" />
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-stone-600" />
              {post.readTimeMinutes || 3} MIN READ
            </span>
            {post.views !== undefined && (
              <>
                <span className="w-1 h-1 bg-stone-700 rounded-full" />
                <span className="flex items-center gap-1">
                  <Eye size={11} className="text-stone-600" />
                  {post.views}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-stone-100 group-hover:text-fuchsia-300 transition-colors uppercase tracking-tight line-clamp-2 mb-3 leading-snug">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-stone-400 leading-relaxed line-clamp-3 mb-6 font-normal">
            {post.excerpt}
          </p>
        </div>

        {/* Footer Area: Author & Actions */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2.5">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-6 h-6 rounded-none object-cover border border-white/20"
              />
            ) : (
              <div className="w-6 h-6 bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-black text-fuchsia-400">
                {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'T'}
              </div>
            )}
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              {post.author?.name || 'TEAMTHEE'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {adminUser.isAuthenticated && onEditPost && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditPost(post);
                }}
                className="p-1.5 bg-white/5 border border-white/10 hover:border-fuchsia-500 text-stone-400 hover:text-fuchsia-400 transition-all text-xs"
                title="Edit Article"
              >
                <Edit3 size={13} />
              </button>
            )}
            <div className="w-6 h-6 flex items-center justify-center text-stone-500 group-hover:text-fuchsia-400 transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

