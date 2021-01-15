const deleteMessages = [
    "Boom. No more post.",
    "That's a nice post you have there. It'd be a shame if something... happened to it.",
    "That's a big no-no.",
    "Yeah, if you could not post anymore, that'd be great.",
    "This message has been deleted by order of the UNITED STATES CENTRAL INTELLIGENCE AGENCY.",
    "Soooo, this is awkward, but I deleted your post.",
    "No. Just no.",
    "ERROR. That pepe was not rare enough or a meme was not dank enough.",
    "CTRL+ALT+DEL.",
    "(witty delete message).",
    "Hey, I just forwarded that post to your boss. I hope you're cool with that.",
    "Dearest friend, I regret to inform you that your post has not been welcomed amongst our court, and thus has hereby been withdrawn. Regards.",
    "Your post is gone... reduced to atoms...",
    "You can kiss that post good-bye, son.",
    "ERR 254: You must be >this< tall to post in this channel.",
    "Trying to post here is a bold strategy, Cotton. Let's see if it works out for him...",
    "Your post did not satisfy the robot overlords. It has been removed.",
    "ERROR 356 -- I didn't like that post.",
    "NOTE: Bot on break; worker Chimps are currently handling moderation duties."
]
const helpMsg = "Here are a list of commands and how to use them.\nRemember, you must be a server admin to enter commands.\n\nNCL:New-Channel-Limit -- This command adds a channel to the whitelist.\nRCL:Remove-Channel-Limit -- This command removes the specified channel from the whitelist.\nlist: shows a list of all whitelisted channels on the server.\n\nA Channel is added or removed by typing /buzzkill [command]-[channelID].\nNOTE: you must use the channel ID, NOT the channel name. This can be accessed by enabling dev mode and right clicking on the desired channel.\n\nExample command:\n/buzzkill NCL-1111111111111111111\nThis will add the channel with the ID 111...111 to the whitelist.\nNOTE: Be sure to remember the '-' between the command and ID."

exports.dms = deleteMessages;
exports.help = helpMsg;