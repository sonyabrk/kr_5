const express = require('express');
const router = express.Router();
const quotesController = require('../controllers/quotesController');

// GET /api/quotes - все цитаты (с query параметрами limit и author)
router.get('/', quotesController.getAllQuotes);

// GET /api/quotes/random - случайная цитата
router.get('/random', quotesController.getRandomQuote);

// GET /api/quotes/search - поиск цитат (query параметр q)
router.get('/search', quotesController.searchQuotes);

// GET /api/quotes/:id - цитата по ID (params)
router.get('/:id', quotesController.getQuoteById);

// POST /api/quotes - добавить новую цитату
router.post('/', quotesController.addQuote);

// PUT /api/quotes/:id - обновить цитату
router.put('/:id', quotesController.updateQuote);

// DELETE /api/quotes/:id - удалить цитату
router.delete('/:id', quotesController.deleteQuote);

module.exports = router;