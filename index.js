const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


/*** Przeszukiwanie folderu 'commands' w poszukiwaniu komend ***/

client.commands = new Collection();						// Kolekcja "worek" do przechowywania informacji o komendach
const foldersPath = path.join(__dirname, 'commands');	// Ścieżka do komend
const commandFolders = fs.readdirSync(foldersPath);		// Wczytaj wszystkie foldery w katalogu commands

for (const folder of commandFolders) {	// Przejrzyj wszystkie podfoldery
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Szukaj tam plików z rozszerzeniem .js
	for (const file of commandFiles) {														// Przejrzyj wszystkie pliki z danego podfolderu
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);													// Pobierz komendę z danego pliku
		if ('data' in command && 'execute' in command) {									// Jeśli posiada dane i funkcję
			client.commands.set(command.data.name, command); 								// Dopisz je do listy komend
		} else {																			// W przeciwnym wypadku
			console.log(`[OSTRZEŻENIE] Komenda w pliku ${filePath} nie posiada wymaganego parametru "data" lub "execute".`); // Wyświetl ostrzeżenie
		}
	}
}


/*** Przeszukiwanie folderu 'events' w poszukiwaniu pozostałych działań bota ***/

const eventsPath = path.join(__dirname, 'events');											// Ścieżka do "zdarzeń"
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));			// Szukaj plików z rozszerzeniem .js

for (const file of eventFiles) {															// Przejrzyj wszystkie znalezione pliki
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);														// Otwórz je pobierz "zdarzenia"
	if (event.once) {																		// Jeśli zdarzenie ma zmienną once ustawioną na true
		client.once(event.name, (...args) => event.execute(...args));						// Dodaj "zdarzenie" które odpala się tylko raz
	} else {																				// W przeciwnym wypadku
		client.on(event.name, (...args) => event.execute(...args));							// Dodaj "zdarzenie" które odpala się za każdym razem
	}
}


/*** Jak już wszystkie parametry bota są ustawione, odpalamy go! ***/
client.login(token);
