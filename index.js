//Dotenv file
require("dotenv").config();

//API
const alpha = require("alphavantage")({ key: process.env.STOCK_API_KEY });

//Discord Bot
const { Client, Intents } = require("discord.js");
const Discord = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const sampleTickers = [
  "CVE",
  "SU",
  "AAPL",
  "TSLA",
  "CNQ",
  "FUBO",
  "FB",
  "SHOP",
  "MSFT",
  "AMZN",
  "GOOGL",
  "NVDA",
  "UNH",
  "JNJ",
  "V",
  "JPM",
  "MA",
  "HD",
  "BAC",
  "KO",
  "COST",
  "DIS",
  "WFC",
  "NKE",
  "CVS",
];
const prefix = ".";

client.once("ready", () => {
  console.log("Bot is Online.");
});

getInput();

function getInput() {
  client.on("message", (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    if (command == "rules") {
      const embed = new Discord.MessageEmbed()
        .setColor("#3498DB")
        .setTitle("Hi! Welcome to Stock Bot's Server!")
        .setThumbnail(
          "https://preview.redd.it/le511uiwkta51.png?auto=webp&s=c840a7b53746cf6842b46260dfaceaec235db6b3"
        )
        .setDescription(
          "Stock bot allows you to check the price of any stock! Make sure to read the commands below. Enjoy!"
        )
        .addFields(
          {
            name: ".list",
            value:
              "Have no idea what you're doing? This command gives a list of 25 sample stock tickers that you can find the prices of!",
          },
          {
            name: ".add",
            value:
              "Want to add to the sample tickers? Use this command to add any stock you would like to the list of sample stocks! EX: .add TU",
            inline: true,
          },
          {
            name: ".price",
            value:
              "Want to know the latest price of any stock? Use this command along with the ticker of the stock you want to know the price of! EX: .price AAPL",
            inline: true,
          }
        );
      msg.channel.send({ embeds: [embed] });
    }

    if (command === "list") {
      msg.channel.send(sampleTickers.join(", "));
    } else if (command == "add") {
      sampleTickers.push(args[0].toUpperCase());
      msg.reply(
        args[0].toUpperCase() +
          " has been added to the list! Type '.list' to check the list."
      );
    } else if (command == "price") {
      args[0].toUpperCase();
      getStockPrices(args[0]).then((price) => {
        console.log(price);
        const priceEmbed = new Discord.MessageEmbed()
          .setColor("#3498DB")
          .setTitle("Here is the latest price for your requested stock:")
          .addFields({
            name: args[0].toUpperCase(),
            value: "$" + (Math.round(price * 100) / 100).toFixed(2),
          });
        msg.channel.send({ embeds: [priceEmbed] });
      });
    }
  });
  client.login(process.env.DISCORD_LOGIN_TOKEN);
}

function getStockPrices(stock) {
  // const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock}&interval=5min&apikey=${process.env.STOCK_API_KEY}`;
  let prices = [];

  return alpha
    .experimental("TIME_SERIES_INTRADAY", {
      symbol: stock,
      market: "USD",
      interval: "5min",
    })
    .then((data) => {
      for (let key in data["Time Series (5min)"]) {
        let openPrice = data["Time Series (5min)"][key]["1. open"];
        prices.push(openPrice);
      }
      return prices[0];
    });
}
