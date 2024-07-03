import TelegramBot, { Message, CallbackQuery } from "node-telegram-bot-api";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN as string, {
  polling: true,
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

bot.onText(/\/start/, async (msg: Message) => {
  const chatId = msg.chat.id;
  const username = msg.from?.username || "";

  let user = await User.findOne({ telegramId: chatId.toString() });
  if (!user) {
    user = new User({ telegramId: chatId.toString(), username });
    await user.save();
  }

  bot.sendMessage(
    chatId,
    "Welcome to the game! Click the button below to increase your points.",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Click Me!", callback_data: "click" }]],
      },
    }
  );
});

bot.on("callback_query", async (callbackQuery: CallbackQuery) => {
  const message = callbackQuery.message as Message;
  const chatId = message.chat.id;
  const userId = callbackQuery.from.id;

  if (callbackQuery.data === "click") {
    let user = await User.findOne({ telegramId: userId.toString() });
    if (user) {
      user.points += 1;
      await user.save();
      bot.answerCallbackQuery(callbackQuery.id, {
        text: `You have ${user.points} points!`,
      });
    }
  }
});

bot.onText(/\/referral/, (msg: Message) => {
  const chatId = msg.chat.id;
  const username = msg.from?.username || "";
  const referralLink = `https://t.me/${bot.getMe().then((me) => me.username)}?start=${chatId}`;

  bot.sendMessage(
    chatId,
    `Share this link to get referral points: ${referralLink}`
  );
});

bot.onText(
  /\/start (\d+)/,
  async (msg: Message, match: RegExpExecArray | null) => {
    const chatId = msg.chat.id;
    const referrerId = match ? match[1] : "";

    let user = await User.findOne({ telegramId: chatId.toString() });
    if (!user) {
      user = new User({
        telegramId: chatId.toString(),
        username: msg.from?.username || "",
      });
      await user.save();
    }

    if (referrerId && referrerId !== chatId.toString()) {
      let referrer = await User.findOne({ telegramId: referrerId });
      if (referrer) {
        referrer.referrals += 1;
        referrer.points += 1; // Reward for referral
        await referrer.save();
        bot.sendMessage(
          referrerId,
          `You have a new referral! You now have ${referrer.referrals} referrals and ${referrer.points} points.`
        );
      }
    }

    bot.sendMessage(
      chatId,
      "Welcome to the game! Click the button below to increase your points.",
      {
        reply_markup: {
          inline_keyboard: [[{ text: "Click Me!", callback_data: "click" }]],
        },
      }
    );
  }
);
