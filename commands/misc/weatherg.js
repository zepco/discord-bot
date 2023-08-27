// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { openWeatherMapKey } = require("../../config.json");
const axios = require("axios");
const path = require('node:path');
const nunjucks = require('nunjucks');
const nodeHtmlToImage = require('node-html-to-image')
  
module.exports = {
  data: new SlashCommandBuilder()
    .setName("pogoda_graf")
    .setDescription("Pokazuje pogodę dla danego miasta.")
    .addStringOption((option) =>
      option.setName("miasto").setDescription("Nazwa miasta").setRequired(true)
    ),
  async execute(interaction) {
    const cityName = interaction.options.getString("miasto");

    const weatherEmbed = new EmbedBuilder()

    let imgAttachment;
    let image;
    const foldersPath = path.join(__dirname, '../../templates');

    interaction.deferReply();

    await axios
      .get("http://api.openweathermap.org/data/2.5/weather", {  // adres zapytania do serwera pogody
        params: {
          q: `${cityName},PL`,        // nazwa miasta w Polsce
          appid: openWeatherMapKey,   // klucz dp API OpenWeatherMap - pobrany z pliku config.json
          lang: "PL",                 // język polski
          units: "metric",            // jednostki metryczne
        },
      })
      .then(async (res) => {  // jeśli wszystko przebiegło pomyślnie
        // console.log(res.data);


        nunjucks.configure(foldersPath, {autoescape: true, noCache: true});
        const html = nunjucks.render('misc/weatherg.html', {data: res.data});
        
        image = await nodeHtmlToImage({
          html: html,
          quality: 100,
          type: 'png',
          puppeteerArgs: {
            args: ['--no-sandbox'],
          },
          encoding: 'buffer',
          transparent: true,
        });

// console.log(Buffer.from(image));

        imgAttachment = new AttachmentBuilder()
          .from(image)
          .setName('pogoda.png')
          .setDescription('Pogoda');

// console.log(imgAttachment);

        res = res.data;
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
          .setImage('attachment://pogoda.png')
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

    return interaction.editReply(
      // { embeds: [weatherEmbed] }
      { embeds: [weatherEmbed], files: [{attachment: imgAttachment}] } 
    );
  },
};
