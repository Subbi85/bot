const axios = require('axios');

module.exports = {
    name: 'spell',
    description: 'Daten zu Zaubern im Game',
    async execute(interaction) {
        // Extract the spell name from the interaction content
        const spellName = interaction.content.split(' ').slice(1).join(' ');

        try {
            // Format the spell name to match the API endpoint
            const formattedName = spellName.toLowerCase().replace(/ /g, '-');
            const response = await axios.get(`https://www.dnd5eapi.co/api/spells/${formattedName}`);
            const spell = response.data;

            // Start building the spell information
            let spellInfo = `**Level:** ${spell.level === 0 ? 'Cantrip' : spell.level}\n`;
            spellInfo += `**Reichweite:** ${spell.range}\n`;

            // Check if the spell has damage data before adding it
            if (spell.damage && spell.damage.damage_at_slot_level) {
                const damage = Object.entries(spell.damage.damage_at_slot_level)
                    .map(([level, dmg]) => `Level ${level}: ${dmg}`).join('\n');
                spellInfo += `**Schaden:**\n${damage}\n`;
            }

            spellInfo += `**Zauberdauer:** ${spell.duration}\n`;
            spellInfo += `**Zauberzeit:** ${spell.casting_time}\n\n`;

            // Join the spell description array into a single string
            spellInfo += `**Beschreibung:** ${spell.desc.join(' ')}\n`;

            // Include higher level description if available
            if (spell.higher_level && spell.higher_level.length > 0) {
                spellInfo += `**Notiz:** ${spell.higher_level.join(' ')}\n`;
            }

            // Create the embed for the response
            const embed = {
                title: spell.name,
                description: spellInfo,
                color: 0x00AE86
            };

            // Respond with the spell data
            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error(error);
            // Handle 404 errors specifically
            if (error.response && error.response.status === 404) {
                await interaction.reply({ content: 'Spell not found. Please check the name and try again.', ephemeral: true });
            } else {
                // General error response
                await interaction.reply({ content: 'There was an error fetching the spell data. Please try again later.', ephemeral: true });
            }
        }
    }
};
