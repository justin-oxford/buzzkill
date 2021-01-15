// dependencies and constants
const Discord    = require('discord.js');
const responses  = require('./responses');
const sql        = require("sqlite");
sql.open("./channels.sqlite");
const client     = new Discord.Client();
// bot functionality on message
client.setInterval(checkTime => {
    // get the current date/time to check
    var d    = new Date();
    var day  = d.getDay();
    var hrs  = d.getHours();
    var mins = d.getMinutes();
    console.log("Checking time...");
    console.log("Mins: " + mins);
    if (hrs == 21 && mins == 0 && day == 5) {
        console.log("It's time for a message");
        sql.each(`SELECT * FROM whitelistweekdays` , (error, row) => {
            try {
                console.log("Found some channels, trying to message them...");
                let serv    = row.serverID;
                let servOBJ = client.guilds.get(serv);
                let chan    = row.channelID;
                console.log(row);
                console.log(serv);
                console.log(servOBJ);
                console.log(chan);
                servOBJ.channels.get(chan).send("This channel is now unlocked. You are free to post.");
            } catch (error) {
                console.log(error);
            }
        });
    }
    if (hrs == 20 && mins == 0 && day == 5) {
        console.log("It's time for a message");
        sql.each(`SELECT * FROM whitelistweekdays` , (error, row) => {
            try {
                console.log("Found some channels, trying to message them...");
                let serv    = row.serverID;
                let servOBJ = client.guilds.get(serv);
                let chan    = row.channelID;
                console.log(row);
                console.log(serv);
                console.log(servOBJ);
                console.log(chan);
                servOBJ.channels.get(chan).send("Notification: This channel is will unlock in 1 hour.");
            } catch (error) {
                console.log(error);
            }
        });
    }
    if (hrs == 24 && mins == 0 && day == 0) {
        console.log("It's time for a message");
        sql.each(`SELECT * FROM whitelistweekdays` , (error, row) => {
            try {
                console.log("Found some channels, trying to message them...");
                let serv    = row.serverID;
                let servOBJ = client.guilds.get(serv);
                let chan    = row.channelID;
                console.log(row);
                console.log(serv);
                console.log(servOBJ);
                console.log(chan);
                servOBJ.channels.get(chan).send("This channel is now locked. All future posts will be deleted until Friday.");
            } catch (error) {
                console.log(error);
            }
        });
    }
},60000);
client.on('message', msg => {
    msgContent = msg.content;
    if (msg.author.bot) {
        // if the message is from the bot itself, then continue. DO NOT DELETE -- Will cause infinite loop of responses.
        return;
    }
    else if (msgContent.substring(0, 10) == '/buzzkill ') {
        if (msg.member.hasPermission("ADMINISTRATOR")){
            // get the command and input that follows
            let command = msgContent.substring(10,14);
            let input   = msgContent.substr(14);
            if (command == 'NCL-') {
                // add desired input into the database
                sql.run("CREATE TABLE IF NOT EXISTS whitelistweekdays (serverID TEXT, channelID TEXT)").then(() => {
                    // check input again database before acting
                    sql.get(`SELECT * FROM whitelistweekdays WHERE serverID = ${msg.guild.id} AND channelID = ${input.trim()}`).then(row => { //the row is the user's data
                        if(!row) {
                            // if not rows are found, then all good to add the new rule
                            sql.run("INSERT INTO whitelistweekdays (serverID, channelID) VALUES (?, ?)", [msg.guild.id, input.trim()])
                            .then(msg.reply("Channel ADDED to whitelist. Users will only be able to post on weekends in: " + msg.guild.channels.get(input).toString()));
                        } else {
                            // if rows are found, the entry already exists; do no allow.
                            msg.reply("ERR: The channel entered is already whitelisted.");
                        }
                    });
                });
            } else if (command == 'RCL-') {
                // remove the channel from the database
                sql.run("CREATE TABLE IF NOT EXISTS whitelistweekdays (serverID TEXT, channelID TEXT)").then(() => {
                    // check input again database before acting
                    sql.get(`SELECT * FROM whitelistweekdays WHERE serverID = ${msg.guild.id} AND channelID = ${input.trim()}`).then(row => { //the row is the user's data
                        if(!row) {
                            // if no rows are found, then the channel was not whitelisted and can't be removed.
                            msg.reply("ERR: The channel entered is not whitelisted.");
                        } else {
                            // if rows are found, delete them.
                            sql.run("DELETE FROM whitelistweekdays WHERE serverID = ? AND channelID = ?", [msg.guild.id, input.trim()])
                            .then(msg.reply("Channel REMOVED from whitelist. Users may now post freely in: " + msg.guild.channels.get(input).toString()));
                        }
                    });
                }); 
            } else if (command == "list"){
                localWhitelist = '\nServer ID (this server)   /   Channel Whitelisted\n------------------------------------------------\n';
                sql.each(`SELECT * FROM whitelistweekdays WHERE serverID = ${msg.guild.id}` , (error, row) => { //the row is the user's data
                    if(!row) {
                        msg.reply("I found no channels whitelisted on this server.");
                    } else {
                        try {
                            var channelName = msg.guild.channels.get(row.channelID);
                            console.log("ChanName: " + channelName);
                        } catch (err) {
                            var channelName = "Error: " + err;
                            console.log(channelName);
                        }
                        localWhitelist += `${row.serverID} / ${channelName} \n`;
                        console.log("LWL:" + localWhitelist);
                    }
                }).then(() => {
                    msg.reply(localWhitelist);
                }); 
            } else if (command == "help") {
                msg.reply(responses.help);
            } else {
                // no command
                msg.reply("Sorry, there was no recognized command. Type '/buzzkill help' for documentation.");
            }
        } else {
            // not an admin
            msg.reply("Sorry, you must be an administrator to make changes to this bot.");
        }
    } else {
        // get the current date/time to check
        var d    = new Date();
        var day  = d.getDay();
        var hrs  = d.getHours();
        var mins = d.getMinutes();
        // check if channel is in the whitelist
        sql.get(`SELECT * FROM whitelistweekdays WHERE serverID = ${msg.guild.id} AND channelID = ${msg.channel.id}`).then(row => { //the row is the user's data
            if(!row) {
                return; // return if it is not; do nothing
            } else {
                // check time against date
                if ((day > 0 && day < 5) || (day == 5 && hrs <= 20) || (day == 0 && hrs >= 24)) {
                    // calculate some variables for time display and random grab
                    let lenm          = responses.dms.length;
                    let seedm         = Math.floor(Math.random() * lenm);
                    let daysTill      = (5 - day) * 24;
                    let hoursTill     = 20 - hrs;
                    let minsTill      = 60 - mins;
                    let totalTimeTill = daysTill + hoursTill;
                    // delete message
                    msg.delete()
                    // reply with image or text
                    .then(
                        number      = 33,
                        imageNumber = Math.floor (Math.random() * number) + 1,
                        msg.channel.send ({files: ["./images/" + imageNumber + ".jpg"]}),
                        msg.reply("Try again in " + totalTimeTill + "hrs " + minsTill + "min.")
                        //msg.reply(responses.dms[seed]+ " Try again in " + totalTimeTill + "hrs " + minsTill + "min.")
                        )
                    .catch(console.error);
                } 
            }
        });
    }
});
//error handlers
client.on('disconnect', () => console.error('Connection lost...'));
client.on('reconnecting', () => console.log('Attempting to reconnect...'));
client.on('error', error => console.error(error));
client.on('warn', info => console.error(info));
client.on('debug', info => console.log(info));
//login token
client.login('NjE4NDc1NjYwNzgzOTEwOTE0.XXqIbA.drJJfyeJg0lr-w-FJ6Fk3hgf4s8');