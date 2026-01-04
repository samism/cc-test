export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type NotePreview = Pick<Note, 'id' | 'title' | 'updatedAt'> & {
  preview: string;
};
