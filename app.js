// Require dotenv
require("dotenv").config();

// Require fs (file system)
const fs = require("fs");

// Require Discord and set up client
const Discord = require("discord.js");
const client = new Discord.Client();

// Require Config to get prefix
const { prefix } = require("./config/config.json");

// Set up Command Handler
client.commands = new Discord.Collection();

// Load the commands
const commandFiles = fs.readdirSync("./commands");

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  // splits the args into an array
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  // removes the first item in the args array to get command
  const commandName = args.shift().toLowerCase();

  // Find the command
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  try {
    command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply(
      "There was an error that occured while running that command, please try again later!"
    );
  }
});

client.login(process.env.token);
