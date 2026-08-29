import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Heading1,
  Heading2,
  Bold,
  Italic,
  Code,
  Quote,
  List,
  Link,
  Image,
  Eye,
  Edit3,
  Columns
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  minHeight?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  minHeight = '360px'
}) => {
  const [viewMode, setViewMode] = useState<'write' | 'preview' | 'split'>('write');

  const insertText = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement | null;
    if (!textarea) {
      onChange(value + before + defaultText + after);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || defaultText;
    const replacement = before + selected + after;

    const newValue =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  return (
    <div className="flex flex-col border border-white/20 bg-[#080808] w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#0e0e0e] border-b border-white/10 text-xs">
        {/* Quick Format Actions */}
        <div className="flex items-center flex-wrap gap-1">
          <button
            type="button"
            onClick={() => insertText('# ', '', 'Header 1')}
            className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            title="Heading 1"
          >
            <Heading1 size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('## ', '', 'Header 2')}
            className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            title="Heading 2"
          >
            <Heading2 size={14} />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            type="button"
            onClick={() => insertText('**', '**', 'bold text')}
            className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('*', '*', 'italic text')}
            className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('```typescript\n', '\n```', '// Code snippet')}
            className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            title="Code Block"
          >
            <Code size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('> ', '', 'Quoted thought')}
            className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            title="Quote"
          >
            <Quote size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('- ', '', 'List item')}
            className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('[', '](https://example.com)', 'Link Title')}
            className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            title="Hyperlink"
          >
            <Link size={14} />
          </button>
          <button
            type="button"
            onClick={() =>
              insertText(
                '![Image description](',
                ')',
                'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800'
              )
            }
            className="p-1.5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            title="Image"
          >
            <Image size={14} />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#050505] p-0.5 border border-white/10">
          <button
            type="button"
            onClick={() => setViewMode('write')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'write' ? 'bg-fuchsia-500 text-black font-black' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Edit3 size={11} />
            <span>WRITE</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'split' ? 'bg-fuchsia-500 text-black font-black' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Columns size={11} />
            <span>SPLIT</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'preview' ? 'bg-fuchsia-500 text-black font-black' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Eye size={11} />
            <span>PREVIEW</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex flex-col md:flex-row w-full bg-[#050505] min-h-[300px]">
        {/* Write Pane */}
        {(viewMode === 'write' || viewMode === 'split') && (
          <div className={`w-full ${viewMode === 'split' ? 'md:w-1/2 md:border-r md:border-white/10' : ''}`}>
            <textarea
              id="markdown-textarea"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write your article content using Markdown syntax... (Use # for title, ```ts for code)"
              style={{ minHeight }}
              className="w-full h-full p-4 bg-transparent text-stone-200 font-mono text-xs md:text-sm focus:outline-none resize-y placeholder:text-stone-700 leading-relaxed"
            />
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`w-full ${
              viewMode === 'split' ? 'md:w-1/2' : ''
            } p-4 overflow-y-auto max-h-[600px] bg-[#070707] prose-cyberpunk text-xs`}
            style={{ minHeight }}
          >
            {value.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <div className="text-stone-700 italic text-center py-12 uppercase tracking-widest font-mono text-xs">
                -- LIVE PREVIEW TERMINAL IDLE --
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

