const { SlashCommandBuilder } = require('discord.js');
const { DateTime } = require("luxon");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};
