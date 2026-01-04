import { useRef, useEffect, useCallback } from 'react';
import type { Note } from '../types';
import './NoteEditor.css';

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: string, content: string) => void;
}

export function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (editorRef.current && note) {
      isInternalUpdate.current = true;
      editorRef.current.innerHTML = note.content;
      isInternalUpdate.current = false;
      editorRef.current.focus();
    } else if (editorRef.current && !note) {
      editorRef.current.innerHTML = '';
    }
  }, [note?.id]); // Only reset when note changes

  const handleInput = useCallback(() => {
    if (note && editorRef.current && !isInternalUpdate.current) {
      onUpdateNote(note.id, editorRef.current.innerHTML);
    }
  }, [note, onUpdateNote]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  }, [execCommand]);

  if (!note) {
    return (
      <div className="note-editor empty">
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
          <p>Select a note or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="editor-toolbar">
        <button
          className="toolbar-btn"
          onClick={() => execCommand('bold')}
          title="Bold (⌘B)"
          aria-label="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          className="toolbar-btn"
          onClick={() => execCommand('italic')}
          title="Italic (⌘I)"
          aria-label="Italic"
        >
          <em>I</em>
        </button>
        <button
          className="toolbar-btn"
          onClick={() => execCommand('underline')}
          title="Underline (⌘U)"
          aria-label="Underline"
        >
          <u>U</u>
        </button>
        <div className="toolbar-divider" />
        <button
          className="toolbar-btn"
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet list"
          aria-label="Bullet list"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="4" cy="6" r="2" />
            <circle cx="4" cy="12" r="2" />
            <circle cx="4" cy="18" r="2" />
            <rect x="8" y="5" width="14" height="2" />
            <rect x="8" y="11" width="14" height="2" />
            <rect x="8" y="17" width="14" height="2" />
          </svg>
        </button>
        <button
          className="toolbar-btn"
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered list"
          aria-label="Numbered list"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <text x="2" y="8" fontSize="6" fontWeight="bold">1</text>
            <text x="2" y="14" fontSize="6" fontWeight="bold">2</text>
            <text x="2" y="20" fontSize="6" fontWeight="bold">3</text>
            <rect x="8" y="5" width="14" height="2" />
            <rect x="8" y="11" width="14" height="2" />
            <rect x="8" y="17" width="14" height="2" />
          </svg>
        </button>
        <div className="toolbar-divider" />
        <button
          className="toolbar-btn"
          onClick={() => execCommand('formatBlock', 'h1')}
          title="Heading 1"
          aria-label="Heading 1"
        >
          H1
        </button>
        <button
          className="toolbar-btn"
          onClick={() => execCommand('formatBlock', 'h2')}
          title="Heading 2"
          aria-label="Heading 2"
        >
          H2
        </button>
        <button
          className="toolbar-btn"
          onClick={() => execCommand('formatBlock', 'p')}
          title="Paragraph"
          aria-label="Paragraph"
        >
          P
        </button>
      </div>
      <div className="editor-meta">
        <span className="note-date">
          {new Date(note.updatedAt).toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </span>
      </div>
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder="Start typing..."
        suppressContentEditableWarning
      />
    </div>
  );
}
