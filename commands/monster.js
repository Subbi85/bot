const axios = require('axios');

module.exports = {
    name: 'monster',
    description: 'Monsterdaten',
    async execute(interaction) {

        const monsterName = interaction.content.split(' ').slice(1).join(' ');

        try {
            const formattedName = monsterName.toLowerCase().replace(/ /g, '-');
            const response = await axios.get(`https://www.dnd5eapi.co/api/monsters/${formattedName}`);

            const monster = response.data;

            let monsterInfo = `**${monster.name}**\n`;
            monsterInfo += `**Groesse:** ${monster.size}\n`;
            monsterInfo += `**Typ:** ${monster.type}\n`;
            monsterInfo += `**Gesinnung:** ${monster.alignment}\n`;
            if (Array.isArray(monster.armor_class)) {
                monsterInfo += `**AC:** ${monster.armor_class.map(ac => ac.value).join(', ')}\n`;
            } else {
                monsterInfo += `**AC:** ${monster.armor_class}\n`;
            }
            monsterInfo += `**HP:** ${monster.hit_points}\n`;
            /*             
            monsterInfo += `**CR:** ${monster.challenge_rating}\n\n`;
            monsterInfo += `**Actions:**\n`;
            monster.actions.forEach(action => {
                monsterInfo += `- **${action.name}:** ${action.desc}\n`;
            });
            */

            const imageUrl = `https://www.dnd5eapi.co/api/images/monsters/${formattedName}.png`;

            const embed = {
                title: monster.name,
                description: monsterInfo,
                image: { url: imageUrl },
                color: 0x00AE86
            };

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                await interaction.reply({ content: 'Monster not found. Please check the name and try again.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error fetching the monster data. Please try again later.', ephemeral: true });
            }
        }
    }
};