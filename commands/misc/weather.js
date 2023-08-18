const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { openWeatherMapKey } = require("../../config.json");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pogoda")
    .setDescription("Pokazuje pogodę dla danego miasta.")
    .addStringOption((option) =>
      option.setName("miasto").setDescription("Nazwa miasta").setRequired(true)
    ),
  async execute(interaction) {
    const cityName = interaction.options.getString("miasto");

    const weatherEmbed = new EmbedBuilder()

    await axios
      .get("http://api.openweathermap.org/data/2.5/weather", {  // adres zapytania do serwera pogody
        params: {
          q: `${cityName},PL`,        // nazwa miasta w Polsce
          appid: openWeatherMapKey,   // klucz dp API OpenWeatherMap - pobrany z pliku config.json
          lang: "PL",                 // język polski
          units: "metric",            // jednostki metryczne
        },
      })
      .then((res) => {  // jeśli wszystko przebiegło pomyślnie
        weatherEmbed
          .setColor(0x00ffff)
          .setTitle('Pogoda')
          .setDescription(`Pogoda dla miasta ${cityName}`)
          .setThumbnail(`https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`)
          .addFields(
            { name: 'Informacje ogólne', value: res.weather[0].description },
            { name: '\u200B', value: '\u200B' },
            { name: 'Temperatura', value: res.main.temp + ' \u00B0C', inline: true },
            { name: 'Temp. odczuwalna', value: res.main.feels_like + ' \u00B0C', inline: true },
            { name: 'Ciśnienie', value: res.main.pressure + ' hPa', inline: true },
            { name: 'Wilgotność', value: res.main.humidity + '%', inline: true },
            { name: 'Zachmurzenie', value: res.clouds.all + '%', inline: true},
            { name: 'Prędk. wiatru', value: res.wind.speed + ' km/h', inline: true},
          )
          .setFooter({text: 'Pogoda w oparciu o OpenWeatherMap'})
          .setTimestamp();
      })
      .catch((error) => { // Przechwyć błędy
        if (error.response) { // Jeśli błąd wysyłany przez serwer API
          weatherEmbed
            .setTitle('Błąd')
            .setDescription(error.response.data.message)
            .setColor(0xFF0000);
        }
      });

    // console.log(res);
  
    return interaction.reply(
      { embeds: [weatherEmbed] }
    );
  },
};
