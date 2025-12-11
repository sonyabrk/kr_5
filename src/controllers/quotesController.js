const fs = require('fs').promises;
const path = require('path');

const quotesPath = path.join(__dirname, '../../data/quotes.json');

// Чтение цитат из файла
const readQuotes = async () => {
  try {
    const data = await fs.readFile(quotesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения файла с цитатами:', error);
    return [];
  }
};

// Запись цитат в файл
const writeQuotes = async (quotes) => {
  try {
    await fs.writeFile(quotesPath, JSON.stringify(quotes, null, 2));
    return true;
  } catch (error) {
    console.error('Ошибка записи файла с цитатами:', error);
    return false;
  }
};

// Получить все цитаты
exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await readQuotes();
    const { limit, author } = req.query;
    
    let filteredQuotes = quotes;
    
    // Фильтрация по автору (query параметр)
    if (author) {
      filteredQuotes = quotes.filter(q => 
        q.author.toLowerCase().includes(author.toLowerCase())
      );
    }
    
    // Лимит (query параметр)
    if (limit && !isNaN(limit)) {
      filteredQuotes = filteredQuotes.slice(0, parseInt(limit));
    }
    
    res.json({
      count: filteredQuotes.length,
      quotes: filteredQuotes
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении цитат' });
  }
};

// Получить случайную цитату
exports.getRandomQuote = async (req, res) => {
  try {
    const quotes = await readQuotes();
    
    if (quotes.length === 0) {
      return res.status(404).json({ error: 'Цитаты не найдены' });
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    res.json(randomQuote);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении случайной цитаты' });
  }
};

// Получить цитату по ID
exports.getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const quotes = await readQuotes();
    const quote = quotes.find(q => q.id === parseInt(id));
    
    if (!quote) {
      return res.status(404).json({ error: 'Цитата не найдена' });
    }
    
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении цитаты' });
  }
};

// Поиск цитат
exports.searchQuotes = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Не указан поисковый запрос' });
    }
    
    const quotes = await readQuotes();
    const searchTerm = q.toLowerCase();
    
    const results = quotes.filter(quote => 
      quote.text.toLowerCase().includes(searchTerm) ||
      quote.author.toLowerCase().includes(searchTerm)
    );
    
    res.json({
      query: q,
      count: results.length,
      quotes: results
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при поиске цитат' });
  }
};

// Добавить новую цитату
exports.addQuote = async (req, res) => {
  try {
    const { text, author } = req.body;
    
    if (!text || !author) {
      return res.status(400).json({ 
        error: 'Текст цитаты и автор обязательны для заполнения' 
      });
    }
    
    const quotes = await readQuotes();
    
    // Генерируем новый ID
    const newId = quotes.length > 0 
      ? Math.max(...quotes.map(q => q.id)) + 1 
      : 1;
    
    const newQuote = {
      id: newId,
      text,
      author,
      createdAt: new Date().toISOString()
    };
    
    quotes.push(newQuote);
    const success = await writeQuotes(quotes);
    
    if (!success) {
      return res.status(500).json({ error: 'Ошибка при сохранении цитаты' });
    }
    
    res.status(201).json({
      message: 'Цитата успешно добавлена',
      quote: newQuote
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении цитаты' });
  }
};

// Обновить цитату
exports.updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;
    
    if (!text && !author) {
      return res.status(400).json({ 
        error: 'Необходимо указать текст или автора для обновления' 
      });
    }
    
    const quotes = await readQuotes();
    const quoteIndex = quotes.findIndex(q => q.id === parseInt(id));
    
    if (quoteIndex === -1) {
      return res.status(404).json({ error: 'Цитата не найдена' });
    }
    
    // Обновляем только переданные поля
    if (text) quotes[quoteIndex].text = text;
    if (author) quotes[quoteIndex].author = author;
    quotes[quoteIndex].updatedAt = new Date().toISOString();
    
    const success = await writeQuotes(quotes);
    
    if (!success) {
      return res.status(500).json({ error: 'Ошибка при обновлении цитаты' });
    }
    
    res.json({
      message: 'Цитата успешно обновлена',
      quote: quotes[quoteIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении цитаты' });
  }
};

// Удалить цитату
exports.deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const quotes = await readQuotes();
    const quoteIndex = quotes.findIndex(q => q.id === parseInt(id));
    
    if (quoteIndex === -1) {
      return res.status(404).json({ error: 'Цитата не найдена' });
    }
    
    const deletedQuote = quotes.splice(quoteIndex, 1);
    const success = await writeQuotes(quotes);
    
    if (!success) {
      return res.status(500).json({ error: 'Ошибка при удалении цитаты' });
    }
    
    res.json({
      message: 'Цитата успешно удалена',
      quote: deletedQuote[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении цитаты' });
  }
};