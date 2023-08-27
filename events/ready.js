const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,	// Zdarzenie na jakie ma reagować
	once: true,					// Czy wykonać komendę tylko raz? true - tak, false - wykonuj za każdym razem gdy wystąpi dane zdarzenie
	execute(client) {			// Funkcja która się wykona za każdym razem kiedy zdarzenie zostanie wywołane
		console.log(`Bot gotowy! Zalogowany jako ${client.user.tag}`);	// Wyświetla na konsoli info o zalogowaniu bota
	},
};
