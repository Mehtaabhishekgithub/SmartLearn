import Note from '../models/Note.js';

// Create
// createNote
export const createNote = async (req, res) => {
  try {
    const { title, content, tags, colorIndex, pinned } = req.body;  // ← add
    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      tags,
      colorIndex: colorIndex ?? 0,  // ← add
      pinned: pinned ?? false,       // ← add
    });
    res.status(201).json({ note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All + Search
export const getNotes = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { user: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};