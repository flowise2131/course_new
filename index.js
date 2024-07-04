const axios = require('axios');
require('dotenv').config();  // Загрузка переменных среды из файла .env
const TelegramBot = require('node-telegram-bot-api');

// Токен бота в Telegram (замените его своим собственным токеном)
const TELEGRAM_BOT_TOKEN = "Ваш Token";

// URL API
const API_URL = "Ваш Url Flowise";

// Функция для выполнения запроса
async function query(data) {
    try {
        const response = await axios.post(API_URL, data, {
            headers: {
                'Authorization': `Bearer Ваш API Flowise`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка в запросе:', error.message);
        throw error;
    }
}

// Функция для обработки сообщений в Telegram
async function handleTelegramMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;

    // Игнорируем команду /start в обработчике сообщений
    if (text === '/start') {
        return;
    }

    try {
        // Логирование входящего сообщения
        console.log(`Входящее сообщение: ${text}`);

        // Выполнение запроса с сообщением пользователя
        const result = await query({ question: text });

        // Извлечение текста из JSON-ответа
        const responseText = result.text || 'Не удалось получить текст ответа';

        // Логирование исходящего сообщения
        console.log(`Ответ: ${responseText}`);

        // Отправка ответа в чат Telegram
        await bot.sendMessage(chatId, responseText);
    } catch (error) {
        console.error('Ошибка при обработке сообщения в Telegram:', error.message);
        await bot.sendMessage(chatId, 'Произошла ошибка при обработке вашего запроса.');
    }
}


// Конфигурация телеграм-бота
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Обработчик сообщений в Telegram
bot.on('message', handleTelegramMessage);

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет!');
});

// Порт для прослушивания (используется порт, определенный переменной среды PORT, или по умолчанию порт 3000)
const port = process.env.PORT || 3000;

// Сообщение о запуске
console.log(`Телеграм-бот запущен. Прослушиваем порт ${port}...`);
