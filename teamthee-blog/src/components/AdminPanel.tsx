import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  Flame,
  Globe,
  Radio,
  Image as ImageIcon
} from 'lucide-react';
import { BlogPost, AdminUser, PostCategory } from '../types/blog';
import { MarkdownEditor } from './MarkdownEditor';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
  onSavePost: (post: Partial<BlogPost> & { id?: string }) => Promise<void>;
  onDeletePost: (id: string) => Promise<void>;
  editingPost: BlogPost | null;
  onSetEditingPost: (post: BlogPost | null) => void;
  isFirebaseOnline: boolean;
}

const PRESET_IMAGES = [
  { label: 'Cyberpunk Matrix', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Deep Server Room', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Neural Glow', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Hardware Blueprint', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Dark Horizon', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Neon Circuit', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80' }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  posts,
  onSavePost,
  onDeletePost,
  editingPost,
  onSetEditingPost,
  isFirebaseOnline
}) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'editor'>('manage');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: PRESET_IMAGES[0].url,
    category: 'UNDERGROUND',
    tags: ['DEV', 'SYSTEM'],
    author: {
      name: 'TEAMTHEE ARCHITECT',
      role: 'Core Member',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
    },
    featured: false,
    published: true,
    readTimeMinutes: 4
  });

  const [tagsInput, setTagsInput] = useState('DEV, SYSTEM');

  // Populate form when editingPost changes
  React.useEffect(() => {
    if (editingPost) {
      setFormData({
        ...editingPost,
        author: editingPost.author || {
          name: 'TEAMTHEE ARCHITECT',
          role: 'Core Member'
        }
      });
      setTagsInput(editingPost.tags ? editingPost.tags.join(', ') : '');
      setActiveTab('editor');
    }
  }, [editingPost]);

  if (!isOpen) return null;

  const handleStartNew = () => {
    onSetEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: `# Transmission Title\n\nEnter transmission details here...\n\n\`\`\`typescript\n// Terminal execution snippet\nconsole.log("TEAMTHEE ONLINE");\n\`\`\``,
      coverImage: PRESET_IMAGES[0].url,
      category: 'UNDERGROUND',
      tags: ['DEV', 'SYSTEM'],
      author: {
        name: 'TEAMTHEE ARCHITECT',
        role: 'Core Member',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
      },
      featured: false,
      published: true,
      readTimeMinutes: 3
    });
    setTagsInput('DEV, SYSTEM');
    setActiveTab('editor');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.content?.trim()) {
      alert('Please provide both an Article Title and Content.');
      return;
    }

    setIsSaving(true);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim().toUpperCase())
        .filter((t) => t.length > 0);

      // Auto estimate read time if not provided
      const wordCount = formData.content.split(/\s+/).length;
      const autoReadTime = Math.max(1, Math.ceil(wordCount / 180));

      await onSavePost({
        ...formData,
        id: editingPost ? editingPost.id : undefined,
        tags: parsedTags,
        readTimeMinutes: formData.readTimeMinutes || autoReadTime
      });

      setNotification(editingPost ? 'Article updated successfully' : 'New article published to nexus');
      setTimeout(() => setNotification(null), 3000);
      setActiveTab('manage');
      onSetEditingPost(null);
    } catch (err: any) {
      alert('Error saving post: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      await onDeletePost(id);
      setNotification('Article purged from system');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#050505]/95 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/20 p-6 md:p-10 my-auto shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase text-fuchsia-500">
                  COMMAND CENTER
                </h2>
                <span className="px-2 py-0.5 bg-white/10 text-stone-300 text-[9px] font-mono font-bold uppercase tracking-widest border border-white/15">
                  CMS v1.2
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isFirebaseOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'
                  }`}
                />
                <p
                  className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                    isFirebaseOnline ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {isFirebaseOnline ? 'Cloud Sync Online (Firebase Active)' : 'Local Mode (Storage in Memory)'}
                </p>
              </div>
            </div>

            {/* Actions & Tab Switcher */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#050505] p-1 border border-white/15">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'manage'
                      ? 'bg-fuchsia-500 text-black font-black'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  MANAGE ({posts.length})
                </button>
                <button
                  type="button"
                  onClick={handleStartNew}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'editor' && !editingPost
                      ? 'bg-fuchsia-500 text-black font-black'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Plus size={14} />
                  <span>NEW ARTICLE</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 border border-white/10 text-stone-500 hover:text-white hover:border-white/30 transition-colors"
                title="Close Command Center"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Notification Banner */}
          {notification && (
            <div className="my-3 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle size={14} />
              <span>{notification}</span>
            </div>
          )}

          {/* Content Area */}
          <div className="overflow-y-auto flex-1 py-6 pr-1">
            {/* TAB 1: MANAGE POSTS */}
            {activeTab === 'manage' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase text-stone-500">
                    PUBLISHED ARTICLES IN DATABASE
                  </span>
                  <button
                    onClick={handleStartNew}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-fuchsia-400 hover:text-fuchsia-300"
                  >
                    <Plus size={14} />
                    <span>WRITE NEW</span>
                  </button>
                </div>

                {posts.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-white/10 text-stone-600 uppercase font-mono text-xs tracking-widest">
                    No articles stored. Click 'NEW ARTICLE' to transmit.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {posts.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/[0.02] border border-white/10 hover:border-white/25 transition-all gap-4"
                      >
                        <div className="flex items-start gap-4">
                          {p.coverImage ? (
                            <img
                              src={p.coverImage}
                              alt=""
                              className="w-16 h-12 object-cover border border-white/10 shrink-0 hidden sm:block"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-stone-600 shrink-0 hidden sm:block">
                              <FileText size={16} />
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                                {p.category}
                              </span>
                              {p.featured && (
                                <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-amber-500 text-black">
                                  FEATURED
                                </span>
                              )}
                              {!p.published && (
                                <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-stone-700 text-white">
                                  DRAFT
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-1">
                              {p.title}
                            </h4>
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">
                              By {p.author?.name || 'Admin'} • {p.readTimeMinutes || 3} min read
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => {
                              onSetEditingPost(p);
                              setActiveTab('editor');
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 text-stone-300 hover:text-fuchsia-300 text-[10px] font-bold uppercase tracking-wider transition-all"
                          >
                            <Edit size={12} />
                            <span>EDIT</span>
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                            title="Delete article"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ARTICLE WRITER / EDITOR */}
            {activeTab === 'editor' && (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-black tracking-widest uppercase text-stone-400">
                    {editingPost ? `EDITING: ${editingPost.title}` : 'COMPOSE NEW TRANSMISSION'}
                  </span>
                  {editingPost && (
                    <button
                      type="button"
                      onClick={() => {
                        onSetEditingPost(null);
                        handleStartNew();
                      }}
                      className="text-[10px] text-stone-500 hover:text-stone-300 uppercase tracking-wider underline"
                    >
                      Clear & Write New
                    </button>
                  )}
                </div>

                {/* Article Title */}
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-stone-400 mb-2">
                    ARTICLE TITLE *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="E.G. TEAMTHEE UNDERGROUND: ARCHITECTURAL OVERVIEW"
                    required
                    className="w-full bg-[#050505] border border-white/20 p-3.5 text-sm font-bold uppercase tracking-wider text-white focus:outline-none focus:border-fuchsia-500"
                  />
                </div>

                {/* Summary / Excerpt */}
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-stone-400 mb-2">
                    EXCERPT / BRIEF SUMMARY *
                  </label>
                  <textarea
                    value={formData.excerpt || ''}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Short synopsis displayed in the blog feed card..."
                    rows={2}
                    required
                    className="w-full bg-[#050505] border border-white/20 p-3 text-xs text-stone-300 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>

                {/* Category & Tags Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest uppercase text-stone-400 mb-2">
                      PRIMARY CATEGORY
                    </label>
                    <select
                      value={formData.category || 'UNDERGROUND'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#050505] border border-white/20 p-3 text-xs font-bold uppercase tracking-wider text-stone-200 focus:outline-none focus:border-fuchsia-500"
                    >
                      <option value="UNDERGROUND">UNDERGROUND</option>
                      <option value="DEV">DEV / CODE</option>
                      <option value="TECH">TECH</option>
                      <option value="AI">AI & AGENTS</option>
                      <option value="SECURITY">SECURITY</option>
                      <option value="SYSTEM">SYSTEM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black tracking-widest uppercase text-stone-400 mb-2">
                      TAGS (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="DEV, REACT, FIREBASE, SYSTEM"
                      className="w-full bg-[#050505] border border-white/20 p-3 text-xs font-bold uppercase tracking-wider text-stone-200 focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>
                </div>

                {/* Cover Image URL & Quick Presets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black tracking-widest uppercase text-stone-400 flex items-center gap-1.5">
                      <ImageIcon size={12} />
                      COVER IMAGE URL
                    </label>
                    <span className="text-[9px] text-stone-500 uppercase tracking-widest">
                      CHOOSE PRESET OR PASTE LINK
                    </span>
                  </div>

                  <input
                    type="url"
                    value={formData.coverImage || ''}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#050505] border border-white/20 p-3 text-xs font-mono text-stone-300 focus:outline-none focus:border-fuchsia-500 mb-3"
                  />

                  {/* Preset Image Selection Chips */}
                  <div className="flex flex-wrap gap-2">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, coverImage: img.url })}
                        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 border transition-all ${
                          formData.coverImage === img.url
                            ? 'border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300'
                            : 'border-white/10 bg-white/5 text-stone-500 hover:text-white'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Author Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/[0.02] border border-white/10">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 mb-1">
                      AUTHOR NAME
                    </label>
                    <input
                      type="text"
                      value={formData.author?.name || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: {
                            name: e.target.value,
                            role: formData.author?.role || 'Core Member',
                            avatar: formData.author?.avatar
                          }
                        })
                      }
                      placeholder="e.g. thee-b01"
                      className="w-full bg-[#050505] border border-white/15 p-2 text-xs font-bold uppercase tracking-wider text-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 mb-1">
                      AUTHOR ROLE / TITLE
                    </label>
                    <input
                      type="text"
                      value={formData.author?.role || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: {
                            name: formData.author?.name || 'TEAMTHEE ARCHITECT',
                            role: e.target.value,
                            avatar: formData.author?.avatar
                          }
                        })
                      }
                      placeholder="e.g. Core Architect"
                      className="w-full bg-[#050505] border border-white/15 p-2 text-xs font-bold uppercase tracking-wider text-stone-200"
                    />
                  </div>
                </div>

                {/* Markdown Content Editor */}
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-stone-400 mb-2">
                    ARTICLE BODY (MARKDOWN SUPPORTED) *
                  </label>
                  <MarkdownEditor
                    value={formData.content || ''}
                    onChange={(val) => setFormData({ ...formData, content: val })}
                  />
                </div>

                {/* Publishing Options & Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="accent-fuchsia-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1">
                        <Flame size={13} className="text-amber-400" />
                        FEATURED IN SPOTLIGHT
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.published !== false}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="accent-fuchsia-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                        PUBLISHED IMMEDIATELY
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('manage')}
                      className="px-4 py-3 bg-white/5 border border-white/15 text-stone-400 hover:text-white text-xs font-bold uppercase tracking-widest"
                    >
                      CANCEL
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-fuchsia-500 text-black text-xs font-black tracking-[0.25em] uppercase hover:bg-fuchsia-400 transition-colors shadow-[0_0_20px_rgba(217,70,239,0.4)] disabled:opacity-50"
                    >
                      <Save size={14} />
                      <span>{isSaving ? 'TRANSMITTING...' : editingPost ? 'UPDATE TRANSMISSION' : 'PUBLISH ARTICLE'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

