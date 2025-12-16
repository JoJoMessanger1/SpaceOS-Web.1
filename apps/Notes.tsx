import React, { useState, useEffect } from 'react';
    import { Save, Trash2, Plus } from 'lucide-react';

    export const NotesApp: React.FC = () => {
        const [notes, setNotes] = useState<{id: number, text: string}[]>([
            {id: 1, text: 'Welcome to Pad!\n\nThis is a simple place to jot down your thoughts.'}
        ]);
        const [activeNoteId, setActiveNoteId] = useState<number>(1);

        const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

        const updateNote = (text: string) => {
            setNotes(prev => prev.map(n => n.id === activeNoteId ? {...n, text} : n));
        };

        const createNote = () => {
            const newId = Date.now();
            setNotes([...notes, {id: newId, text: 'New Note'}]);
            setActiveNoteId(newId);
        };

        const deleteNote = (e: React.MouseEvent, id: number) => {
            e.stopPropagation();
            if (notes.length === 1) return;
            const newNotes = notes.filter(n => n.id !== id);
            setNotes(newNotes);
            if (activeNoteId === id) setActiveNoteId(newNotes[0].id);
        };

        return (
            <div className="h-full flex bg-white">
                {/* Sidebar */}
                <div className="w-48 bg-gray-50 border-r flex flex-col">
                    <div className="p-4 border-b bg-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-gray-700">Notes</h2>
                        <button onClick={createNote} className="text-yellow-600 hover:bg-yellow-100 p-1 rounded">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {notes.map(note => (
                            <div 
                                key={note.id}
                                onClick={() => setActiveNoteId(note.id)}
                                className={`p-3 border-b cursor-pointer hover:bg-yellow-50 transition-colors ${activeNoteId === note.id ? 'bg-yellow-100' : ''}`}
                            >
                                <div className="font-semibold text-sm truncate text-gray-800">
                                    {note.text.split('\n')[0] || 'New Note'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1 truncate">
                                    {note.text.split('\n')[1] || 'No additional text'}
                                </div>
                                <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100">
                                    <Trash2 size={12} className="text-red-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-1 flex flex-col h-full bg-yellow-50/30">
                    <div className="p-2 text-xs text-gray-400 text-center border-b">
                        {new Date().toLocaleString()}
                    </div>
                    <textarea 
                        className="flex-1 p-8 bg-transparent outline-none resize-none text-gray-800 font-medium leading-relaxed"
                        value={activeNote?.text || ''}
                        onChange={(e) => updateNote(e.target.value)}
                        placeholder="Type something..."
                    />
                </div>
            </div>
        );
    };
