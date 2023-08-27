const { Events } = require('discord.js');
const { clientId } = require('../config.json');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        if (message.content.toLowerCase().includes("fajnie") && message.author.id != clientId)
        {
            message.reply("Ano fajnie, bardzo fajnie! :-)");
        }
    },
};
