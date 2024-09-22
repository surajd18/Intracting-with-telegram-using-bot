const axios = require("axios"); // Library used to make HTTP requests
const TeleBot = require("node-telegram-bot-api"); //Library used to interact with the Telegram Bot API

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; //The token provided by BotFather to authenticate bot
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; //The ID of the chat where the bot will send messages.
const BaseURL = "https://en.wikipedia.org/api/rest_v1/page/random/summary"; //The endpoint for fetching a random Wikipedia article summary.

const Bot = new TeleBot(TELEGRAM_BOT_TOKEN, { polling: true }); //Initializes a new Telegram bot and enables polling to receive updates.

//Defines an asynchronous function to fetch a random Wikipedia article.
async function getRandomArticleFromWiki() {
  try {
    const response = await axios.get(BaseURL);
    return {
      //Returns the article title and summary.
      title: response.data.title,
      summary: response.data.extract,
    };
  } catch (err) {
    console.error("Error in Fetching Wikipedia Article: ", err);
    throw err;
  }
}
//Defines an asynchronous function to send a message to a Telegram chat.
async function postToTelegram(chatId, message) {
  try {
    await Bot.sendMessage(TELEGRAM_CHAT_ID, message, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error posting to Telegram:", error);
    throw error;
  }
}

//Set up an event listener for the /wiki command
Bot.onText(/\/wiki/, async (msg) => {
  //Listens for messages that match the /wiki command.

  try {
    const article = await getRandomArticleFromWiki();
    const message = `*${article.title}*\n\n${article.summary})`; //Formats the article title and summary into a message string.
    await postToTelegram(TELEGRAM_CHAT_ID, message);
    console.log("Message posted to Telegram");
  } catch (error) {
    console.error("Error in main function:", error);
  }
});
