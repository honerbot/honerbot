const { default: fetch } = require("node-fetch");

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
fs = require("fs"),
roles = {"optimizer": "794932986956611597", "vip": "794984057666011157", "mvp": "794984199680425995", "pro": "794984234024435754"}

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
    if (msg.content.startsWith("h-say") && msg.channel.id == "772869010319998997") {
        message = msg.content.split(" ")
        message.shift()
        message = message.join(" ")
        bot.createMessage("794978574452654080", message)
    }
    if (msg.content.startsWith("h-say") && msg.channel.recipient.id == "407348579376693260") {
        message = msg.content.split(" ")
        message.shift()
        message = message.join(" ")
        bot.createMessage("794978574452654080", message)
    }

    if (msg.content.toLowerCase().includes("skins") && msg.content.toLowerCase().includes("http")) {
        return potentialScam(msg)
    }

    if (msg.content.toLowerCase().includes("nitro") && msg.content.toLowerCase().includes("st") && msg.content.toLowerCase().includes("http")) {
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
        if (msg?.messageReference) return;
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

bot.registerCommand("scaninvites", (msg, args) => {
    if (msg.member?.roles.indexOf("762758600338309172") == -1) return;
    if (msg.channel.id != "772869010319998997") return;
    if (args.length == 0) return msg.channel.createMessage("You need to provide an ID!");

    msg.channel.guild.fetchMembers({
        userIDs: args[0]
    }).then(users => {
        if (!users.length) {
            return msg.channel.createMessage({
                "embed": {
                    "description": `:x: Couldn't find that user!`
                }
            })
        }
        fetch("https://api.manage-invite.xyz/guilds/753315331564371999/members/" + args[0], {
            "headers": {
                "Authorization": "Bearer " + process.env.inviteToken
            }
        }).then(r=>r.json()).then(j=>{
            let invites = j.data.invites,
            role = [];
            
            // removing roles
            if (invites < 20 && users[0].roles.includes(roles["optimizer"])) {
                users[0].removeRole(roles["optimizer"], "HONER BOT: Has went below 20 invites.");
                role.push("- [ optimizer ]")
            }
            if (invites < 50 && users[0].roles.includes(roles["vip"])) {
                users[0].removeRole(roles["vip"], "HONER BOT: Has went below 50 invites.")
                role.push("- [ vip ]")
            }
            if (invites < 75 && users[0].roles.includes(roles["mvp"])) {
                users[0].removeRole(roles["mvp"], "HONER BOT: Has went below 75 invites.")
                role.push("- [ mvp ]")
            }
            if (invites < 150 && users[0].roles.includes(roles["pro"])) {
                users[0].removeRole(roles["pro"], "HONER BOT: Has went below 150 invites.")
                role.push("- [ pro ]")
            }

            // adding roles
            if (invites >= 20 && !users[0].roles.includes(roles["optimizer"])) {
                role.push("+ [ optimizer ]")
                users[0].addRole(roles["optimizer"], "HONER BOT: Has went above or equal to 20 invites.");
            }
            if (invites >= 50 && !users[0].roles.includes(roles["vip"])) {
                role.push("+ [ vip ]")
                users[0].addRole(roles["vip"], "HONER BOT: Has went above or equal to 50 invites.")
            }
            if (invites >= 75 && !users[0].roles.includes(roles["mvp"])) {
                role.push("+ [ mvp ]")
                users[0].addRole(roles["mvp"], "HONER BOT: Has went above or equal to 75 invites.")
            }
            if (invites >= 150 && !users[0].roles.includes(roles["pro"])) {
                role.push("+ [ pro ]")
                users[0].addRole(roles["pro"], "HONER BOT: Has went above or equal to 150 invites.")
            }

            bot.createMessage("861084246487203850", users[0].mention+"'s new roles!\n```diff\n"+roles.split("\n")+"```")
            msg.channel.createMessage(users[0].mention+"'s new roles!\n```diff\n"+roles.split("\n")+"```")
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
