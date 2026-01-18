const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

client.on("messageCreate", message => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.channel.send("🏓 Bot läuft!");
  }
});

client.login(process.env.BOT_TOKEN);
