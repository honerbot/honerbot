require("dotenv").config();
const Eris = require("eris");

const bot = new Eris.CommandClient("Bot " + process.env.token, {
    restMode: true
}, {
    description: "Making life easier for Hone staff.",
    owner: "lemons",
    prefix: [process.env.prefix, "@mention "]
});

let boostCount;

bot.on("ready", () => {
    console.log("Ready!");
    bot.editStatus("online", {
        "name": "over Hone",
        "type": 3
    })
    boostCount = bot.getChannel("786730183804977163").guild.premiumSubscriptionCount;
});

bot.on("error", (err) => {
    console.error(err);
});

bot.on("messageCreate", (msg) => {
    function potentialScam(msg) {
        return bot.createMessage("861084246487203850", {
            "embed": {
                "title": "Potential scam!",
                "fields": [{
                    "name": "Message Link",
                    "value": `[Jump!](${msg.jumpLink})`
                }, {
                    "name": "Message",
                    "value": msg.content
                }, {
                    "name": "User",
                    "value": `<@${msg.author.id}> (${msg.author.id})`
                }]
            }
        })
    }

    if (msg.content.toLowerCase().includes("skins") && msg.content.toLowerCase().includes("http")) {
        potentialScam(msg)
    }

    if (msg.content.toLowerCase().includes("give") && msg.content.toLowerCase().includes("http")) {
        potentialScam(msg)
    }

    if (msg.content.toLowerCase().includes("trade") && msg.content.toLowerCase().includes("http")) {
        potentialScam(msg)
    }

    if (msg.content.toLowerCase().includes("free") && msg.content.toLowerCase().includes("case") && msg.content.toLowerCase().includes("http")) {
        potentialScam(msg)
    }
});

bot.registerCommand("gwhois", (msg, args) => {
    if (msg.channel.id != "772869010319998997") return;
    if (args.length == 0) {
        return msg.channel.createMessage({
            "embed": {
                "description": `<@${msg.author.id}>`,
                "footer": {
                    "icon_url": "https://cdn.discordapp.com/attachments/798314687321735199/821861569830977616/Screenshot-20200818-075705-removebg-preview.png",
                    "text": `ID: ${msg.author.id} • Honer`
                },
                "thumbnail": {
                    "url": msg.author.avatarURL
                },
                "author": {
                    "name": `${msg.author.username}#${msg.author.discriminator}`,
                    "icon_url": msg.author.avatarURL
                },
                "fields": [{
                    "name": "Registered",
                    "value": new Date(msg.author.createdAt).toGMTString(),
                    "inline": true
                }]
            }
        })
    }
    args = [...new Set(args)];
    args.forEach(async id => {
        if (id.includes("<@")) {
            return msg.channel.createMessage({
                "embed": {
                    "description": `:x: Only IDs are supported.`
                }

            });
        }
        let req = await bot.getRESTUser(id).catch(() => {
            return msg.channel.createMessage({
                "embed": {
                    "description": `:x: Couldn't find ${id}!`
                }
            })
        });
        let user = req;
        if (!user?.username) return;
        msg.channel.createMessage({
            "embed": {
                "description": `<@${user.id}>`,
                "footer": {
                    "icon_url": "https://cdn.discordapp.com/attachments/798314687321735199/821861569830977616/Screenshot-20200818-075705-removebg-preview.png",
                    "text": `ID: ${user.id} • Honer`
                },
                "thumbnail": {
                    "url": user.avatarURL
                },
                "author": {
                    "name": `${user.username}#${user.discriminator}`,
                    "icon_url": user.avatarURL
                },
                "fields": [{
                    "name": "Registered",
                    "value": new Date(user.createdAt).toGMTString(),
                    "inline": true
                }]
            }
        })
    })
}, {
    description: "Find a user outside of the server.",
    fullDescription: "Find a user outside of the server with getRESTUser. This command is only available in Staff Commands."
})

bot.registerCommand("whois", (msg, args) => {
    if (msg.channel.id != "772869010319998997") return;
    if (!args.length) {
        return msg.channel.createMessage({
            "embed": {
                "description": `<@${msg.member.id}>`,
                "footer": {
                    "icon_url": "https://cdn.discordapp.com/attachments/798314687321735199/821861569830977616/Screenshot-20200818-075705-removebg-preview.png",
                    "text": `ID: ${msg.member.id} • GMT • Honer`
                },
                "thumbnail": {
                    "url": msg.member.avatarURL
                },
                "author": {
                    "name": `${msg.member.username}#${msg.member.discriminator}`,
                    "icon_url": msg.member.avatarURL
                },
                "fields": [{
                    "name": "Joined",
                    "value": new Date(msg.member.joinedAt).toGMTString().slice(0, -4),
                    "inline": true
                }, {
                    "name": "Registered",
                    "value": new Date(msg.member.createdAt).toGMTString().slice(0, -4),
                    "inline": true
                }, {
                    "name": `Roles [${msg.member.roles.length}]`,
                    "value": msg.member.roles.length ? `<@&${msg.member.roles.join("> <@&")}>` : "None",
                }]
            }
        })
    }
    msg.mentions.forEach(user => args.push(user.id))
    msg.channel.guild.fetchMembers({
        userIDs: [...new Set(args.filter(id => !id.includes("<@")))]
    }).then(users => {
        if (!users.length) {
            return msg.channel.createMessage({
                "embed": {
                    "description": `:x: Couldn't find that user!`
                }
            })
        }
        users.forEach(user => {
            msg.channel.createMessage({
                "embed": {
                    "description": `<@${user.id}>`,
                    "footer": {
                        "icon_url": "https://cdn.discordapp.com/attachments/798314687321735199/821861569830977616/Screenshot-20200818-075705-removebg-preview.png",
                        "text": `ID: ${user.id} • GMT • Honer`
                    },
                    "thumbnail": {
                        "url": user.avatarURL
                    },
                    "author": {
                        "name": `${user.username}#${user.discriminator}`,
                        "icon_url": user.avatarURL
                    },
                    "fields": [{
                        "name": "Joined",
                        "value": new Date(user.joinedAt).toGMTString().slice(0, -4),
                        "inline": true
                    }, {
                        "name": "Registered",
                        "value": new Date(user.createdAt).toGMTString().slice(0, -4),
                        "inline": true
                    }, {
                        "name": `Roles [${user.roles.length}]`,
                        "value": user.roles.length ? `<@&${user.roles.join("> <@&")}>` : "None",
                    }]
                }
            })
        })
    })
}, {
    description: "Find a user inside of the server.",
    fullDescription: "Find a user inside of the server with fetchMembers. This command is only available in Staff Commands."
})

bot.on("guildMemberUpdate", (guild, member, oldMember) => {
    if (boostCount == guild.premiumSubscriptionCount) return;
    if (boostCount > guild.premiumSubscriptionCount) return boostCount = guild.premiumSubscriptionCount;
    if (boostCount < guild.premiumSubscriptionCount) {
        if (member?.roles.find(role => role == "754798744406458459") && !oldMember?.roles.find(role => role == "754798744406458459")) bot.createMessage("861084246487203850", `<@${member.id}> has **boosted** the server! The current boost count is now **${guild.premiumSubscriptionCount}**.`)
        if (member?.roles.find(role => role == "754798744406458459") && oldMember?.roles.find(role => role == "754798744406458459")) bot.createMessage("861084246487203850", `<@${member.id}> has **boosted** the server again! The current boost count is now **${guild.premiumSubscriptionCount}**.`)
        return boostCount = guild.premiumSubscriptionCount;
    }
})

bot.connect();