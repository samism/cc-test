import { useState, useCallback, useEffect } from 'react';
import { Sidebar, NoteEditor } from './components';
import { useNotes } from './hooks';
import './App.css';

function App() {
  const { notePreviews, createNote, updateNote, deleteNote, getNote, searchNotes } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote = selectedNoteId ? getNote(selectedNoteId) : null;

  // Auto-select first note or clear selection when notes change
  useEffect(() => {
    if (selectedNoteId && !getNote(selectedNoteId)) {
      // Selected note was deleted, select next available
      setSelectedNoteId(notePreviews[0]?.id ?? null);
    }
  }, [notePreviews, selectedNoteId, getNote]);

  const handleCreateNote = useCallback(() => {
    const newNote = createNote();
    setSelectedNoteId(newNote.id);
  }, [createNote]);

  const handleDeleteNote = useCallback((id: string) => {
    deleteNote(id);
    if (selectedNoteId === id) {
      const remainingNotes = notePreviews.filter(n => n.id !== id);
      setSelectedNoteId(remainingNotes[0]?.id ?? null);
    }
  }, [deleteNote, selectedNoteId, notePreviews]);

  return (
    <div className="app">
      <Sidebar
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        searchNotes={searchNotes}
      />
      <NoteEditor
        note={selectedNote ?? null}
        onUpdateNote={updateNote}
      />
    </div>
  );
}

export default App;
