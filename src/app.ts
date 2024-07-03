import { Telegraf } from "telegraf";

// Replace with your bot token
const bot = new Telegraf("7321219493:AAHKXfqUa68bcqkhdLrUF_Eqo4AeDvLNfbk");

// 🚀 ~ bot.start ~ userName: Kay_Crypto
// 🚀 ~ bot.start ~ userId: 625250960

bot.start((ctx) => {
    
  // get the user's telegram id
  const userId = ctx.from.id;
  //   console.log("🚀 ~ bot.start ~ userId:", userId)

  // get the user's name
  const userName = ctx.from.username;
  //   console.log("🚀 ~ bot.start ~ userName:", userName)

  // get the message typed by the user
  const message = ctx.message.text;
  console.log("🚀 ~ bot.start ~ message:", message);

  // if message is a link, extract the referral code from the link and save it to the database
  //   if (message && message !== "/start") {
  //     const referralCode = message.split("https://t.me/BuffyClickerBot?start=")[1];
  //     console.log("🚀 ~ bot.start ~ referralCode:", referralCode);
  //   }

  ctx.reply(
    `💲 Don't waste your time – make every second count. Tap and earn with our Time Farm app!

    We have some exciting news! We’re launching our Telegram mini app, so you can start accumulating points right now from your phone or desktop! And who knows what incredible rewards will soon be available...
    
    🚀 Open the app every 4 hours to claim your points. Start now to get ready for future campaigns.`
    , {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Referral Points", callback_data: "referral" }],
        [
            {
                text: "Join Channel",
                url: "https://t.me/BuffyClickerBot",
            }
        ],
        [
          {
            text: "Open Web App",
            web_app: {
              url: `https://buffy-clicker.netlify.app?id=${userId}&userName=${userName}`,
            },
          },
        ],
      ],
    },
  });
});

bot.action("increase", (ctx) => {
  // Logic for increasing points
  ctx.answerCbQuery("Your points have been increased!");
});

bot.action("referral", (ctx) => {
  // Logic for referral points
  ctx.getChatMember(ctx.from.id).then((member) => {
    if (member.status === "left") {
      ctx.answerCbQuery("Join the channel to get referral points!");
    } else {
      ctx.answerCbQuery("You have referral points!");
    }
  });

  ctx.answerCbQuery("You have referral points!");
});

bot.launch();

console.log("Bot is running...");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
