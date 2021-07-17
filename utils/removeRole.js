const { Message, GuildMember, MessageEmbed } = require("discord.js");
const { roles } = require("../config/config.json");

/**
 *
 * @param {GuildMember} user
 * @param {Message} message
 * @param {("mvp" | "vip" | "optimizer" | "pro")} role
 * @param {MessageEmbed} embed
 */
function removeRole(user, message, role, embed) {
  let roleID = roles[role];
  if (roleID === undefined) {
    embed.setColor("#ff6961");
    embed.setDescription(
      ":x: That role doesn't seem like something I can remove."
    );
    embed.setFooter(
      message.author.tag,
      message.author.avatarURL({ dynamic: true, format: "png" })
    );
    embed.setTimestamp();
    return embed;
  }
  try {
    let r = message.guild.roles.cache.get(roleID);
    user.roles.remove(r);
    embed.setColor("#77DD77");
    embed.setDescription(
      `✅ I removed <@${user.user.id}> the role \`${r.name}\``
    );
    embed.setFooter(
      message.author.tag,
      message.author.avatarURL({ dynamic: true, format: "png" })
    );
    embed.setTimestamp();
    return embed;
  } catch (e) {
    embed.setColor("#ff6961");
    embed.setDescription(`:x: It doesn't appear that the user has the role.`);
    embed.setFooter(
      message.author.tag,
      message.author.avatarURL({ dynamic: true, format: "png" })
    );
    embed.setTimestamp();
    return embed;
  }
}

module.exports = {
  removeRole,
};
