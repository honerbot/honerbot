const { Client, Message, MessageEmbed } = require("discord.js");
const { removeRole } = require("../utils/removeRole");

module.exports = {
  name: "removerole",
  aliases: ["rr"],
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
    try {
      let user = await message.guild.members.fetch(args[0]);
      return message.channel.send(removeRole(user, message, args[1], embed));
    } catch (e) {
      console.log(e);
      embed.setColor("#ff6961");
      embed.setDescription(":x: I couldn't seem to find that user!");
      embed.setFooter(
        message.author.tag,
        message.author.avatarURL({ dynamic: true, format: "png" })
      );
      embed.setTimestamp();
      return message.channel.send(embed);
    }
  },
};
