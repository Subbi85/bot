const axios = require("axios");

module.exports = {
    name: "ssearch",
    description: "Monsterssuche mit Stichwörtern",
    async execute(interaction) {

        const terms = interaction.content.split(" ").slice(1).join(" ");
        const formattedName = terms.toLowerCase().replace(/ /g, "+");

        try {
            const response = await axios.get(`https://www.dnd5eapi.co/api/spells/?name=${formattedName}`);
            let spellResult = "";

            if (response.data.results.length > 0) {
                response.data.results.forEach(element => {
                    const linkName = element.name.replace(/ /g, "%20")
                    const monsterLink = `https://roll20.net/compendium/dnd5e/${linkName}#content`;
                    spellResult += `[**${element.name}**](${monsterLink})\n\n`; 
                });
            } else {
                spellResult = "Keine Suchergebnisse gefunden.";
            }

            const embed = {
                title: "Suchergebnisse:",
                description: spellResult,
                color: 0x00AE86
            };
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 404) {
                await interaction.reply({ content: "Keine Suchergebnisse gefunden", ephemeral: true });
            } else {
                await interaction.reply({ content: "Fehler", ephemeral: true });
            }
        }
    }
}