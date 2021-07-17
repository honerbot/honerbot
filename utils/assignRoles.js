const { Message, GuildMember, MessageEmbed } = require("discord.js");
const { roles } = require("../config/config.json");

/**
 *
 * @param {GuildMember} user
 * @param {Message} message
 * @param {("mvp" | "vip" | "optimizer" | "pro")} role
 * @param {MessageEmbed} embed
 */
function assignRole(user, message, role, embed) {
  let roleID = roles[role];
  if (roleID === undefined) {
    embed.setColor("#ff6961");
    embed.setDescription(
      ":x: That role doesn't seem like something I can give."
    );
    embed.setFooter(
      message.author.tag,
      message.author.avatarURL({ dynamic: true, format: "png" })
    );
    embed.setTimestamp();
    return embed;
  }
  let r = message.guild.roles.cache.get(roleID);
  user.roles.add(r);
  embed.setColor("#77DD77");
  embed.setDescription(`✅ I gave <@${user.user.id}> the role ${r.name}`);
  embed.setFooter(
    message.author.tag,
    message.author.avatarURL({ dynamic: true, format: "png" })
  );
  embed.setTimestamp();
  return embed;
}

module.exports = {
  assignRole,
};
