require("dotenv").config();
const Eris = require("eris");

const bot = new Eris.CommandClient("Bot " + process.env.token, {
    restMode: true
}, {
    description: "Making life easier for Hone staff.",
    owner: "lemons",
    prefix: [process.env.prefix, "@mention "]
});

let boostCount,
suspicious = {};

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

bot.on("guildMemberAdd", (guild, member) => {
    if (member.username.includes("gg/motion")) {
        member.ban(0, "Honer: MOTION BOT")
        return bot.createMessage("861084246487203850", `${member.mention} (${member.id}) was banned.`)
    }
})

bot.on("messageDelete", msg => {
    if (msg.author && suspicious[msg.author.id]) {
        const index = suspicious[msg.author.id].suspiciousMessages.indexOf(msg);
        if (index == -1) return;
        suspicious[msg.author.id].suspiciousMessages.splice(index, 1);
    }
})

bot.on("messageCreate", msg => {
    function potentialScam(msg) {
            if (!suspicious[msg.author.id]?.vl) {
                suspicious[msg.author.id] = {
                    "suspiciousMessages": [],
                    "vl": 0
                }
            }
            if (suspicious[msg.author.id].vl++ == 3) {
                msg.member.addRole("753650045475356774", "Honer: Passed VL4.").catch()
                msg.author.getDMChannel().then(chan=>chan.createMessage("You were muted in Hone for sending Scam Links. Please change your password and create a ticket in <#785211122516230144> to become unmuted.")).catch()
                msg.delete().catch();
                suspicious[msg.author.id].suspiciousMessages.forEach(msg => {
                    msg.delete("Honer: Scam links.").catch()
                })
                return bot.createMessage("861084246487203850", {
                    "embed": {
                        "color": 15158332,
                        "title": "Potential scammer automuted.",
                        "fields": [{
                            "name": "User",
                            "value": `<@${msg.author.id}> (${msg.author.id})`
                        }]
                    }
                })
            } else {
                suspicious[msg.author.id].suspiciousMessages.push(msg);
                if (suspicious[msg.author.id].vl == 1) {
                    return bot.createMessage("861084246487203850", {
                        "content": "||<@&862034553808093184>||", 
                        "embed": {
                            "color": 15158332,
                            "title": "Potential scam!",
                            "fields": [{
                                "name": "Message Link",
                                "value": `[Jump!](${msg.jumpLink})`
                            },  {
                                "name": "User",
                                "value": `<@${msg.author.id}> (${msg.author.id})`
                            },  {
                                "name": "VL",
                                "value": suspicious[msg.author.id].vl
                            }]
                        }
                    })
                } else {
                    return bot.createMessage("861084246487203850", {
                        "embed": {
                            "color": 15158332,
                            "title": "Potential scam!",
                            "fields": [{
                                "name": "Message Link",
                                "value": `[Jump!](${msg.jumpLink})`
                            },  {
                                "name": "User",
                                "value": `<@${msg.author.id}> (${msg.author.id})`
                            },  {
                                "name": "VL",
                                "value": suspicious[msg.author.id].vl
                            }]
                        }
                    })
                }
            }
    }

    if (msg.content.toLowerCase().includes("skins") && msg.content.toLowerCase().includes("http")) {
        return potentialScam(msg)
    }

    if (msg.content.toLowerCase().includes("give") && msg.content.toLowerCase().includes("http")) {
        return potentialScam(msg)
    }

    if (msg.content.toLowerCase().includes("trade") && msg.content.toLowerCase().includes("http")) {
        return potentialScam(msg)
    }

    if (msg.content.toLowerCase().includes("free") && msg.content.toLowerCase().includes("case") && msg.content.toLowerCase().includes("http")) {
        return potentialScam(msg)
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
    if (boostCount > guild.premiumSubscriptionCount) {
        bot.createMessage("861084246487203850", `The server has **lost a boost**. The current boost count is now **${guild.premiumSubscriptionCount}**.`)
        return boostCount = guild.premiumSubscriptionCount;
    }
    if (boostCount < guild.premiumSubscriptionCount) {
        if (member?.roles.find(role => role == "754798744406458459") && !oldMember?.roles.find(role => role == "754798744406458459")) bot.createMessage("861084246487203850", `<@${member.id}> has **boosted** the server! The current boost count is now **${guild.premiumSubscriptionCount}**.`)
        if (member?.roles.find(role => role == "754798744406458459") && member?.premiumSince > oldMember?.premiumSince) bot.createMessage("861084246487203850", `<@${member.id}> has **boosted** the server again! The current boost count is now **${guild.premiumSubscriptionCount}**.`)
        return boostCount = guild.premiumSubscriptionCount;
    }
})

bot.on("guildBanAdd", (guild, user) => {
    if (suspicious.indexOf(user.id) != -1) {
        suspicious.splice(suspicious.indexOf(user.id), 1)
        return bot.createMessage("861084246487203850", {
            "embed": {
                "color": 15158332,
                "title": "Potential scammer banned.",
                "fields": [{
                    "name": "User",
                    "value": `<@${user.id}> (${user.id})`
                }]
            }
        })
    }
})

bot.connect();