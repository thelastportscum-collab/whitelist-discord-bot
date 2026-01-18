const { Client, GatewayIntentBits } = require("discord.js");
const http = require("http");

// 🔹 NUR ERLAUBTE INTENTS
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

// 🔹 HTTP SERVER FÜR GOOGLE
const server = http.createServer((req, res) => {

  if (req.method !== "POST") {
    res.writeHead(200);
    return res.end("Bot läuft");
  }

  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);

      const channel = await client.channels.fetch(
        process.env.CHANNEL_ID
      );

      if (channel) {
        await channel.send(
          "📝 **Whitelist angenommen**\n\n" +
          "**IC-Name:** " + data.icname + "\n" +
          "**Discord:** " + data.discord + "\n" +
          "**Steam ID:** " + data.steamid
        );
      }

      res.writeHead(200);
      res.end("OK");

    } catch (err) {
      console.error("Fehler:", err);
      res.writeHead(500);
      res.end("ERROR");
    }
  });
});

// 🔹 PORT FÜR RENDER
server.listen(process.env.PORT || 3000);

// 🔹 BOT STARTEN
client.login(process.env.BOT_TOKEN);
