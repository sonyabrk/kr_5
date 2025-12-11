// Кастомный middleware для логирования запросов
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl, ip } = req;
  
  console.log(`[${timestamp}] ${method} ${originalUrl} - IP: ${ip}`);
  
  // Логируем тело запроса для POST/PUT запросов
  if (['POST', 'PUT'].includes(method) && req.body) {
    console.log('Body:', JSON.stringify(req.body));
  }
  
  next();
};

module.exports = requestLogger;