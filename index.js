require("dotenv").config();
const Eris = require("eris"),
bot = new Eris.CommandClient("Bot " + process.env.token, {
    restMode: true
}, {
    description: "Making life easier for Hone staff.",
    owner: "lemons",
    prefix: [process.env.prefix, "@mention "]
}),
hastebin = require("hastebin-paste"),
fs = require("fs");

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

// bot.on("guildMemberAdd", (guild, member) => {
//     if (member.username.includes("gg/motion")) {
//         member.ban(0, "Honer: MOTION BOT")
//         return bot.createMessage("861084246487203850", `${member.mention} (${member.id}) was banned.`)
//     }
// })

bot.on("messageDelete", msg => {
    if (msg.author && suspicious[msg.author.id]) {
        const index = suspicious[msg.author.id].suspiciousMessages.indexOf(msg);
        if (index == -1) return;
        suspicious[msg.author.id].suspiciousMessages.splice(index, 1);
    }
})

bot.on("messageCreate", msg => {
    if (msg.content.toLowerCase().includes("skins") && msg.content.toLowerCase().includes("http")) {
        return potentialScam(msg)
    }

    if (msg.content.toLowerCase().includes("skin") && msg.content.toLowerCase().includes("gift") && msg.content.toLowerCase().includes("http")) {
        return potentialScam(msg)
    }

    if (msg.content.toLowerCase().includes("summer") && msg.content.toLowerCase().includes("steam") && msg.content.toLowerCase().includes("http")) {
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

    if (msg.mentions.length != 0) {
        if (msg.member?.roles.indexOf("762758600338309172") != -1) return;
        let IDs = [];
        msg.mentions.forEach(user => IDs.push(user.id))
        msg.channel.guild.fetchMembers({
            userIDs: IDs
        }).then(members => {
            members.forEach(member => {
                if (member.roles.indexOf("793425429147025439") != -1) {
                    msg.delete()
                    return msg.channel.createMessage("Please do not ping Hone Admins and above.").then(msg=>setTimeout(()=>msg.delete(), 5000))
                }
                if (member.roles.indexOf("773841259105222687") != -1) {
                    msg.delete()
                    return msg.channel.createMessage("Please do not ping Hone Admins and above.").then(msg=>setTimeout(()=>msg.delete(), 5000))
                }
                if (member.roles.indexOf("856686649823330375") != -1) {
                    msg.delete()
                    return msg.channel.createMessage("Please do not ping Hone Admins and above.").then(msg=>setTimeout(()=>msg.delete(), 5000))
                }
                if (member.roles.indexOf("793508240381575181") != -1) {
                    msg.delete()
                    return msg.channel.createMessage("Please do not ping Hone Admins and above.").then(msg=>setTimeout(()=>msg.delete(), 5000))
                }
                if (member.roles.indexOf("849535394017181716") != -1) {
                    msg.delete()
                    return msg.channel.createMessage("Please do not ping Hone Admins and above.").then(msg=>setTimeout(()=>msg.delete(), 5000))
                }
                if (member.roles.indexOf("783059857955618866") != -1) {
                    msg.delete()
                    return msg.channel.createMessage("Please do not ping Hone Admins and above.").then(msg=>setTimeout(()=>msg.delete(), 5000))
                }
            })
        })
    }

    async function potentialScam(msg) {
            if (msg.channel?.recipient) return;
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
                    let link = await hastebin(msg.content, { url: "https://hst.sh", extention: "txt", message: "", prefix: ""}).catch(()=>{
                        link = "Unable to create link."
                    })
                    return bot.createMessage("861084246487203850", {
                        "content": "||<@&862034553808093184>||", 
                        "embed": {
                            "color": 15158332,
                            "title": "Potential scam!",
                            "fields": [{
                                "name": "Message Link",
                                "value": `[Jump!](${msg.jumpLink})`
                            },  {
                                "name": "Message",
                                "value": link
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
                    let link = await hastebin(msg.content, { url: "https://hst.sh", extention: "txt", message: "", prefix: ""}).catch(()=>{
                        link = "Unable to create link."
                    })
                    return bot.createMessage("861084246487203850", {
                        "embed": {
                            "color": 15158332,
                            "title": "Potential scam!",
                            "fields": [{
                                "name": "Message Link",
                                "value": `[Jump!](${msg.jumpLink})`
                            },  {
                                "name": "Message",
                                "value": link
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
});

bot.registerCommand("removerole", (msg, args) => {
    if (msg.member?.roles.indexOf("762758600338309172") == -1) return;
    let roles = {"optimizer": "794932986956611597", "vip": "794984057666011157", "mvp": "794984199680425995", "pro": "794984234024435754"}

    if (msg.channel.id != "772869010319998997") return;
    if (args.length == 0) return msg.channel.createMessage("You need to provide an ID and a role!\nAvailable roles: Optimizer, VIP, MVP, Pro");
    if (!roles[args[1].toLowerCase()]) return msg.channel.createMessage("You need to provide a role!")
    
    msg.channel.guild.fetchMembers({
        userIDs: args[0]
    }).then(user => {
        if (!user.length) {
            return msg.channel.createMessage({
                "embed": {
                    "description": `:x: Couldn't find that user!`
                }
            })
        }
        user[0].removeRole(roles[args[1]], `The ${args[1]} role was removed by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}).`)
        msg.channel.createMessage("The role was successfully removed!")
        bot.createMessage("861084246487203850", `The ${args[1]} role was removed from ${user[0].username}#${user[0].discriminator} (${user[0].id}) by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}).`)
        let role = JSON.parse(fs.readFileSync("roles.json"))
        bot.getMessage("855832663994531850", role[user[0].id]).then(msg=>msg.delete());
        delete role[user[0].id]
        fs.writeFileSync("roles.json", JSON.stringify(role));
    })
})

bot.registerCommand("assignrole", (msg, args) => {
    if (msg.member?.roles.indexOf("762758600338309172") == -1) return;
    let roles = {"optimizer": "794932986956611597", "vip": "794984057666011157", "mvp": "794984199680425995", "pro": "794984234024435754"}

    if (msg.channel.id != "772869010319998997") return;
    if (args.length == 0) return msg.channel.createMessage("You need to provide an ID and a role!\nAvailable roles: Optimizer, VIP, MVP, Pro");
    if (!roles[args[1].toLowerCase()]) return msg.channel.createMessage("You need to provide a role!")
    
    msg.channel.guild.fetchMembers({
        userIDs: args[0]
    }).then(user => {
        if (!user.length) {
            return msg.channel.createMessage({
                "embed": {
                    "description": `:x: Couldn't find that user!`
                }
            })
        }
        user[0].addRole(roles[args[1]], `The ${args[1]} role was assigned by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}).`)
        msg.channel.createMessage("The role was successfully assigned!")
        bot.createMessage("861084246487203850", `The ${args[1]} role was assigned to ${user[0].username}#${user[0].discriminator} (${user[0].id}) by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}).`)
        bot.createMessage("855832663994531850", `<@${user[0].id}> (${user[0].id})`).then(msg => {
            let role = JSON.parse(fs.readFileSync("roles.json"))
            role[user[0].id] = msg.id
            fs.writeFileSync("roles.json", JSON.stringify(role));
        })
    })
})

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

bot.connect();
