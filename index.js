const { Client, GatewayIntentBits } = require("discord.js");
const http = require("http");

// 🔹 Discord Client (nur erlaubte Intents)
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔹 Bot bereit
client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

// 🔹 HTTP Server für Google Apps Script
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

      if (!channel) {
        console.error("❌ Channel nicht gefunden");
        res.writeHead(404);
        return res.end("Channel not found");
      }

      let message = "";

      if (data.status === "Angenommen") {
        message =
          "✅ **Whitelist angenommen**\n\n" +
          "**IC-Name:** " + data.icname + "\n" +
          "**Discord:** " + data.discord + "\n" +
          "**Steam ID:** " + data.steamid;
      } else if (data.status === "Abgelehnt") {
        message =
          "❌ **Whitelist abgelehnt**\n\n" +
          "**IC-Name:** " + data.icname + "\n" +
          "**Discord:** " + data.discord + "\n" +
          "**Steam ID:** " + data.steamid;
      } else {
        res.writeHead(400);
        return res.end("Ungültiger Status");
      }

      await channel.send(message);

      res.writeHead(200);
      res.end("OK");

    } catch (error) {
      console.error("❌ Fehler:", error);
      res.writeHead(500);
      res.end("Server Error");
    }
  });
});

// 🔹 Render Port
server.listen(process.env.PORT || 3000);

// 🔹 Bot Login
client.login(process.env.BOT_TOKEN);

