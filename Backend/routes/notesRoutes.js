import express from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/notesController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

router.post('/', protect, createNote);
router.get('/', protect, getNotes);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

export default router;