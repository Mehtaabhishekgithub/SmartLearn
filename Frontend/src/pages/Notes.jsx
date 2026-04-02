import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/notesService.js';
import toast from 'react-hot-toast';
import Loader from '../components/Loader.jsx';

const NOTE_COLORS = [
  { bg: '#eff6ff', border: '#bfdbfe', text: '#1e3a5f' },
  { bg: '#f5f3ff', border: '#ddd6fe', text: '#3b0764' },
  { bg: '#f0fdf4', border: '#bbf7d0', text: '#14532d' },
  { bg: '#fffbeb', border: '#fde68a', text: '#78350f' },
  { bg: '#fff1f2', border: '#fecdd3', text: '#881337' },
  { bg: '#f8fafc', border: '#e2e8f0', text: '#0f172a' },
];

const COLOR_DOTS = [
  { value: 0, color: '#3b82f6' },
  { value: 1, color: '#7c3aed' },
  { value: 2, color: '#16a34a' },
  { value: 3, color: '#d97706' },
  { value: 4, color: '#e11d48' },
  { value: 5, color: '#64748b' },
];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [visibleNotes, setVisibleNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', tags: '', colorIndex: 0 });
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => { fetchNotes(); }, []);

  useEffect(() => {
    setVisibleNotes([]);
    notes.forEach((note, i) => {
      setTimeout(() => {
        setVisibleNotes(prev => [...prev, note._id]);
      }, i * 80);
    });
  }, [notes]);

  const fetchNotes = async (searchVal = '') => {
    try {
      const res = await getNotes(searchVal);
      const data = res.data.notes;
      const sorted = [...data].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
      setNotes(sorted);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchNotes(val);
  };

  const openCreate = () => {
    setEditNote(null);
    setForm({ title: '', content: '', tags: '', colorIndex: 0 });
    setShowForm(true);
  };

  const openEdit = (note) => {
    setEditNote(note);
    setForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
      colorIndex: note.colorIndex ?? 0,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error('Title and content required!');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      content: form.content,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      colorIndex: form.colorIndex,
    };
    try {
      if (editNote) {
        const res = await updateNote(editNote._id, payload);
        setNotes(notes.map(n => n._id === editNote._id ? res.data.note : n));
        toast.success('Note updated!');
      } else {
        const res = await createNote(payload);
        setNotes([res.data.note, ...notes]);
        toast.success('Note created!');
      }
      setShowForm(false);
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setRemovingId(id);
    setTimeout(async () => {
      try {
        await deleteNote(id);
        setNotes(prev => prev.filter(n => n._id !== id));
        toast.success('Note deleted!');
      } catch {
        toast.error('Failed to delete');
      }
      setRemovingId(null);
    }, 300);
  };

  const handlePin = async (note) => {
    try {
      const res = await updateNote(note._id, { ...note, pinned: !note.pinned });
      const updated = notes.map(n => n._id === note._id ? res.data.note : n);
      const sorted = [...updated].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
      setNotes(sorted);
      toast.success(res.data.note.pinned ? '📌 Pinned!' : 'Unpinned');
    } catch {
      toast.error('Failed to pin');
    }
  };

  if (loading) return <Loader text="Loading your notes..." />;

  return (
    <div
      className="min-h-screen page-enter"
      style={{ background: 'linear-gradient(135deg, #f0f0ff 0%, #fdf4ff 50%, #eff6ff 100%)', color: '#1f2937' }}
    >
      {/* Navbar */}
      <div
        className="sticky top-0 z-50 backdrop-blur"
        style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderBottom: '1px solid #e9d5ff' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1f2937' }}>My Notes</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
              Organize and manage all your notes in one place
            </p>
          </div>

          <div className="flex items-center gap-3">
            
             <a href="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-80"
              style={{ backgroundColor: '#ede9fe', color: '#7c3aed', height: '40px' }}
            >
              <span>⊞</span>
              <span className="hidden sm:inline">Dashboard</span>
            </a>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#3b82f6', color: '#fff', height: '40px' }}
            >
              <span className="text-base font-bold">+</span>
              <span className="hidden sm:inline">New Note</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Search */}
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
            style={{ backgroundColor: '#fff', border: '1.5px solid #e9d5ff', color: '#1f2937' }}
          />
        </div>

        {/* Create / Edit Form */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showForm ? 'max-h-[700px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#fff', border: '1.5px solid #e9d5ff', boxShadow: '0 4px 24px rgba(124,58,237,0.08)' }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: '#1f2937' }}>
              {editNote ? '✏️ Edit Note' : '📝 New Note'}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', color: '#1f2937' }}
              />
              <textarea
                placeholder="Write your note here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', color: '#1f2937' }}
              />
              <input
                type="text"
                placeholder="Tags e.g. react, hooks"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', color: '#1f2937' }}
              />

              {/* Color Picker */}
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: '#6b7280' }}>Note color:</span>
                <div className="flex gap-2">
                  {COLOR_DOTS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setForm({ ...form, colorIndex: c.value })}
                      className="w-6 h-6 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: c.color,
                        transform: form.colorIndex === c.value ? 'scale(1.3)' : 'scale(1)',
                        outline: form.colorIndex === c.value ? '2px solid #7c3aed' : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60 active:scale-95"
                  style={{ backgroundColor: '#3b82f6', color: '#fff' }}
                >
                  {saving ? 'Saving...' : editNote ? 'Update' : 'Save Note'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl text-sm transition"
                  style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {notes.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-base font-medium" style={{ color: '#6b7280' }}>
              {search ? 'No notes found.' : 'No notes yet.'}
            </p>
            <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
              {search ? 'Try a different keyword.' : 'Click + New Note to get started!'}
            </p>
          </div>
        ) : (
          <>
            {notes.some(n => n.pinned) && (
              <p className="text-xs uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#9ca3af' }}>
                📌 Pinned
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {notes.map((note) => {
                const color = NOTE_COLORS[note.colorIndex ?? 0];
                const isVisible = visibleNotes.includes(note._id);
                const isRemoving = removingId === note._id;

                return (
                  <div
                    key={note._id}
                    className="rounded-2xl p-5 flex flex-col justify-between group cursor-default"
                    style={{
                      backgroundColor: color.bg,
                      border: `1.5px solid ${color.border}`,
                      color: color.text,
                      transition: 'all 0.3s ease',
                      opacity: isVisible && !isRemoving ? 1 : 0,
                      transform: isRemoving
                        ? 'scale(0.9) translateY(8px)'
                        : isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(16px)',
                      minHeight: '180px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div>
                      {note.pinned && (
                        <span className="text-xs text-amber-500 mb-1 block">📌 Pinned</span>
                      )}
                      <h3 className="text-base sm:text-lg font-bold mb-2 line-clamp-1"
                        style={{ color: color.text }}>
                        {note.title}
                      </h3>
                      <p className="text-sm leading-relaxed line-clamp-3 mb-3"
                        style={{ color: color.text, opacity: 0.75 }}>
                        {note.content}
                      </p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {note.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded-lg"
                              style={{ backgroundColor: 'rgba(0,0,0,0.08)', color: color.text }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className="flex justify-between items-center pt-3"
                      style={{ borderTop: `1px solid ${color.border}` }}
                    >
                      <span className="text-xs" style={{ color: color.text, opacity: 0.5 }}>
                        {new Date(note.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handlePin(note)}
                          className="p-1.5 rounded-lg transition hover:bg-black/5"
                          title={note.pinned ? 'Unpin' : 'Pin'}
                          style={{ color: note.pinned ? '#f59e0b' : color.text }}
                        >
                          📌
                        </button>
                        <button
                          onClick={() => openEdit(note)}
                          className="p-1.5 rounded-lg transition hover:bg-black/5"
                          style={{ color: color.text }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="p-1.5 rounded-lg transition hover:bg-black/5"
                          style={{ color: '#ef4444' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={openCreate}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 hover:scale-110 active:scale-95 z-50"
        style={{ backgroundColor: '#7c3aed', color: '#fff', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
        title="New Note"
      >
        +
      </button>
    </div>
  );
};

export default Notes;