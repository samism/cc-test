import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Note, NotePreview } from '../types';

const STORAGE_KEY = 'apple-notes-data';

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function extractPreview(content: string, maxLength = 100): string {
  const text = content.replace(/<[^>]*>/g, '').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

function extractTitle(content: string): string {
  const text = content.replace(/<[^>]*>/g, '').trim();
  const firstLine = text.split('\n')[0] || '';
  if (firstLine.length <= 50) return firstLine || 'New Note';
  return firstLine.substring(0, 50).trim() + '...';
}

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY, []);

  const createNote = useCallback((): Note => {
    const now = Date.now();
    const newNote: Note = {
      id: generateId(),
      title: 'New Note',
      content: '',
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, [setNotes]);

  const updateNote = useCallback((id: string, content: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? {
              ...note,
              content,
              title: extractTitle(content),
              updatedAt: Date.now(),
            }
          : note
      )
    );
  }, [setNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, [setNotes]);

  const getNote = useCallback((id: string): Note | undefined => {
    return notes.find(note => note.id === id);
  }, [notes]);

  const notePreviews = useMemo((): NotePreview[] => {
    return notes
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map(note => ({
        id: note.id,
        title: note.title,
        preview: extractPreview(note.content),
        updatedAt: note.updatedAt,
      }));
  }, [notes]);

  const searchNotes = useCallback((query: string): NotePreview[] => {
    if (!query.trim()) return notePreviews;
    const lowerQuery = query.toLowerCase();
    return notePreviews.filter(
      note =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.preview.toLowerCase().includes(lowerQuery)
    );
  }, [notePreviews]);

  return {
    notes,
    notePreviews,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    searchNotes,
  };
}
