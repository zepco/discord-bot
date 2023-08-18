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

    const res = await axios
      .get("http://api.openweathermap.org/data/2.5/weather", {
        params: {
          q: `${cityName},PL`,
          appid: openWeatherMapKey,
          lang: "PL",
          units: "metric",
        },
      })
      .then((res) => {
        return res.data;
      });

    // console.log(res);

    const weatherEmbed = new EmbedBuilder()
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
  
    return interaction.reply(
      { embeds: [weatherEmbed] }
    );
  },
};
