const express = require('express');
const cors = require('cors');
const quotesRoutes = require('./routes/quotesRoutes');
const requestLogger = require('./middleware/requestLogger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); 

app.use(express.static('public'));

app.use('/api/quotes', quotesRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Добро пожаловать в API генератора цитат!',
    endpoints: {
      getAllQuotes: 'GET /api/quotes',
      getRandomQuote: 'GET /api/quotes/random',
      getQuoteById: 'GET /api/quotes/:id',
      searchQuotes: 'GET /api/quotes/search?q=текст',
      addQuote: 'POST /api/quotes',
      updateQuote: 'PUT /api/quotes/:id',
      deleteQuote: 'DELETE /api/quotes/:id'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

module.exports = app;