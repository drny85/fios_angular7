//jshint esversion:6

const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');

const noteController = require('../controllers/notes');

// add new note route
router.post('/new_note', auth, noteController.addNote);

router.get('/date/:date', auth, noteController.getNotesByDate);

// get today's notes.
router.get('/today', auth, noteController.getTodayNotes);
//delete a note
router.delete('/delete/:id', noteController.deleteNote);

router.get('/:id', auth, noteController.getNote);




module.exports = router;