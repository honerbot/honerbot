const { Client, Message, MessageEmbed } = require("discord.js");
const { roles, commandChannel } = require("../config/config.json");
const { assignRole } = require("../utils/assignRoles");

module.exports = {
  name: "assignrole",
  aliases: ["ar", "giverole"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    const embed = new MessageEmbed();
    if (args.length < 1)
      return message.reply("I require two arguments not one.");
    let user = await message.guild.members.fetch(args[0]);
    if (!user) {
      embed.setColor("#ff6961");
      embed.setDescription(":x: I couldn't seem to find that user!");
      embed.footer(
        message.author.tag,
        message.author.avatarURL({ dynamic: true, format: "png" })
      );
      embed.setTimestamp();
      return message.channel.send(embed);
    }
    message.channel.send(assignRole(user, message, args[1], embed));
  },
};
