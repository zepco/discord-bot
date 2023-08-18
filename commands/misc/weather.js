const { SlashCommandBuilder } = require("discord.js");
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

    return interaction.reply(
      `Informacje o pogodzie: ${res.weather[0].description}, temperatura: ${res.main.temp}, odczuwalna ${res.main.feels_like}, ciśnienie ${res.main.pressure} hPa, wilgotność ${res.main.humidity}`
    );
  },
};
