import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { Search, Radio, Sparkles, Flame, Terminal, Filter, RefreshCw } from 'lucide-react';
import { db, isFirebaseConfigured } from './firebase/config';
import { BlogPost, AdminUser, PostCategory } from './types/blog';
import { initialPosts } from './data/initialPosts';
import { LogoBadge } from './components/LogoBadge';
import { Header } from './components/Header';
import { BlogCard } from './components/BlogCard';
import { ArticleModal } from './components/ArticleModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';

export function App() {
  // State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Modals & Auth State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isFirebaseOnline, setIsFirebaseOnline] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    const saved = localStorage.getItem('teamthee_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { isAuthenticated: false };
      }
    }
    return { isAuthenticated: false };
  });

  // 1. Listen for Firestore updates
  useEffect(() => {
    if (!db) {
      console.log('Using local fallback state');
      setPosts(initialPosts);
      setIsFirebaseOnline(false);
      return;
    }

    try {
      const postsCol = collection(db, 'posts');
      const q = query(postsCol, orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedPosts: BlogPost[] = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...(docSnap.data() as Omit<BlogPost, 'id'>)
            }));
            setPosts(fetchedPosts);
          } else {
            // First time setup: populate with initial posts
            setPosts(initialPosts);
          }
          setIsFirebaseOnline(true);
        },
        (err) => {
          console.warn('Firestore connection fallback to local:', err.message);
          setPosts(initialPosts);
          setIsFirebaseOnline(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore setup error:', err);
      setPosts(initialPosts);
      setIsFirebaseOnline(false);
    }
  }, []);

  // Admin Auth persistence
  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    localStorage.setItem('teamthee_admin_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdminUser({ isAuthenticated: false });
    localStorage.removeItem('teamthee_admin_session');
    setIsAdminPanelOpen(false);
  };

  // Create / Update post handler
  const handleSavePost = async (postData: Partial<BlogPost> & { id?: string }) => {
    if (db && isFirebaseOnline) {
      try {
        if (postData.id) {
          // Update existing
          const postRef = doc(db, 'posts', postData.id);
          const updatePayload = {
            ...postData,
            updatedAt: serverTimestamp()
          };
          delete updatePayload.id;
          await updateDoc(postRef, updatePayload);
        } else {
          // Add new
          const newPayload = {
            ...postData,
            createdAt: serverTimestamp(),
            views: 0
          };
          delete newPayload.id;
          await addDoc(collection(db, 'posts'), newPayload);
        }
        return;
      } catch (err) {
        console.error('Firebase save error, saving to local state:', err);
      }
    }

    // Local State Fallback
    if (postData.id) {
      setPosts((prev) =>
        prev.map((p) => (p.id === postData.id ? ({ ...p, ...postData } as BlogPost) : p))
      );
    } else {
      const newPost: BlogPost = {
        ...postData,
        id: 'post-' + Date.now(),
        createdAt: new Date().toISOString(),
        views: 0,
        published: postData.published !== false,
        title: postData.title || 'Untitled Post',
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        category: postData.category || 'UNDERGROUND',
        tags: postData.tags || [],
        author: postData.author || { name: 'TEAMTHEE ADMIN' }
      } as BlogPost;
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  // Delete post handler
  const handleDeletePost = async (id: string) => {
    if (db && isFirebaseOnline) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        return;
      } catch (err) {
        console.error('Firebase delete error, removing from local state:', err);
      }
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // Only show published posts to non-admins
    if (!adminUser.isAuthenticated && !post.published) return false;

    // Category filter
    if (selectedCategory !== 'ALL' && post.category !== selectedCategory) {
      return false;
    }

    // Tag filter
    if (selectedTag && !post.tags?.includes(selectedTag)) {
      return false;
    }

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(q);
    const excerptMatch = post.excerpt.toLowerCase().includes(q);
    const contentMatch = post.content.toLowerCase().includes(q);
    const tagMatch = post.tags?.some((t) => t.toLowerCase().includes(q));
    const authorMatch = post.author?.name.toLowerCase().includes(q);

    return titleMatch || excerptMatch || contentMatch || tagMatch || authorMatch;
  });

  // Featured Spotlight Post
  const featuredPost = posts.find((p) => p.featured && (adminUser.isAuthenticated || p.published));

  const categories: PostCategory[] = ['ALL', 'UNDERGROUND', 'DEV', 'TECH', 'AI', 'SECURITY', 'SYSTEM'];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] font-['Space_Grotesk'] selection:bg-fuchsia-500/20 overflow-x-hidden relative">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-purple-900/10 blur-[140px] rounded-full opacity-40" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-fuchsia-900/10 blur-[140px] rounded-full opacity-30" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-indigo-950/15 blur-[160px] rounded-full opacity-20" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 md:py-16">
        {/* Navigation / System Header */}
        <Header
          adminUser={adminUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onOpenAdminPanel={() => {
            setEditingPost(null);
            setIsAdminPanelOpen(true);
          }}
          onOpenNewPost={() => {
            setEditingPost(null);
            setIsAdminPanelOpen(true);
          }}
          isFirebaseOnline={isFirebaseOnline}
        />

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 items-start">
          {/* Hero Left: Logo & Identity */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-8"
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedTag(null);
                setSearchQuery('');
              }}
            >
              <LogoBadge />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                TEAMTHEE <br />
                <span className="text-stone-600">JOURNAL</span>
              </h1>
              <p className="text-stone-400 text-sm md:text-base max-w-md leading-relaxed mb-8 font-medium">
                Official Knowledge Terminal & Engineering Logs by TEAMTHEE UNDERGROUND.
                Architectural breakdowns, system directives, and code transmissions.
              </p>

              {/* Terminal Search Input */}
              <div className="relative w-full max-w-md group">
                <div className="relative flex items-center bg-[#0a0a0a] border border-white/20 p-0.5 transition-all group-focus-within:border-fuchsia-500 shadow-xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="QUERY TERMINAL..."
                    className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none text-xs text-stone-200 placeholder:text-stone-700 font-bold uppercase tracking-widest"
                  />
                  <Search
                    className="absolute left-3.5 text-stone-600 group-focus-within:text-fuchsia-500 transition-colors"
                    size={16}
                    strokeWidth={2.5}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-[10px] text-stone-600 hover:text-white mr-3 font-mono"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Right: Featured Post Spotlight or Transmission Radar */}
          <div className="lg:col-span-6">
            {featuredPost ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative bg-[#0a0a0a] border border-fuchsia-500/40 p-6 md:p-8 overflow-hidden group cursor-pointer shadow-[0_0_30px_rgba(217,70,239,0.15)]"
                onClick={() => setSelectedPost(featuredPost)}
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-fuchsia-500 text-black text-[9px] font-black uppercase tracking-widest">
                    <Flame size={12} fill="currentColor" />
                    TRANSMISSION SPOTLIGHT
                  </span>
                  <span className="text-[10px] font-bold font-mono text-stone-500 uppercase tracking-widest">
                    {featuredPost.category}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white group-hover:text-fuchsia-300 transition-colors mb-3 leading-snug">
                  {featuredPost.title}
                </h2>

                <p className="text-xs text-stone-400 leading-relaxed mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-300">
                      By {featuredPost.author?.name || 'TEAMTHEE'}
                    </span>
                    <span className="text-stone-700">•</span>
                    <span className="text-[10px] font-bold text-stone-500">
                      {featuredPost.readTimeMinutes || 4} MIN READ
                    </span>
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-fuchsia-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    READ LOG →
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="h-full border border-dashed border-white/15 p-8 flex flex-col justify-center items-center text-center">
                <Terminal size={36} className="text-stone-700 mb-3" />
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
                  SYSTEM READY // AWAITING NEW TRANSMISSIONS
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Category & Tag Filter Bar */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedTag(null);
                }}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat && !selectedTag
                    ? 'bg-white text-black font-black'
                    : 'bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Tag Indicator */}
          {selectedTag && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-stone-500 uppercase">Filtered by:</span>
              <span className="px-2.5 py-1 bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-[10px] font-bold uppercase">
                #{selectedTag}
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[10px] text-stone-600 hover:text-stone-300 uppercase underline ml-1"
              >
                Clear
              </button>
            </div>
          )}

          <div className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-widest shrink-0 self-end sm:self-auto">
            {filteredPosts.length} ARTICLES INDEXED
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  adminUser={adminUser}
                  onSelectPost={(p) => setSelectedPost(p)}
                  onEditPost={(p) => {
                    setEditingPost(p);
                    setIsAdminPanelOpen(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty Search State matching Portal */
          <div className="py-24 flex flex-col items-center justify-center border border-dashed border-white/10">
            <Search size={32} className="text-stone-800 mb-4" />
            <p className="text-xs tracking-[0.3em] text-stone-600 font-black uppercase mb-2">
              NO RESULTS FOUND IN NEXUS
            </p>
            <p className="text-[10px] text-stone-700 uppercase font-mono">
              Try adjusting your query terminal keywords or selected categories
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <span className="text-[10px] tracking-[0.5em] uppercase text-stone-800 font-black">
              TEAMTHEE V1.0
            </span>
            <div className="w-px h-4 bg-white/10" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-stone-600 font-bold">
              TEAMTHEE UNDERGROUND // BLOG TERMINAL // CLOUD SYNC // FIREBASE
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-stone-600">
            <span>COMMAND PROTOCOL ACTIVE</span>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </footer>
      </div>

      {/* Reader Modal */}
      <ArticleModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onSelectTag={(tag) => setSelectedTag(tag)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          handleLoginSuccess(user);
          setIsAdminPanelOpen(true);
        }}
      />

      {/* Admin Panel CMS */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => {
          setIsAdminPanelOpen(false);
          setEditingPost(null);
        }}
        posts={posts}
        onSavePost={handleSavePost}
        onDeletePost={handleDeletePost}
        editingPost={editingPost}
        onSetEditingPost={setEditingPost}
        isFirebaseOnline={isFirebaseOnline}
      />
    </div>
  );
}
export default App;

