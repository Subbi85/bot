const axios = require('axios');

module.exports = {
    name: 'item',
    description: 'Fetches data about magical items in D&D 5e',
    async execute(interaction) {
        const itemName = interaction.content.split(' ').slice(1).join(' ');

        try {
            const formattedName = itemName.toLowerCase().replace(/ /g, '-');        
            const response = await axios.get(`https://www.dnd5eapi.co/api/magic-items/${formattedName}`);
            const item = response.data;

            // Start building the item information
            let itemInfo = `**Name:** ${item.name}\n`;
            itemInfo += `**Kategorie:** ${item.equipment_category.name}\n`;
            itemInfo += `**Seltenheit:** ${item.rarity.name}\n`;
            if (item.desc && item.desc.length > 0) {
                let description = item.desc.join(' ');
                if (description.length > 1000) {
                    description = description.substring(0, 497) + '...';
                }
                itemInfo += `**Beschreibung:** ${description}\n`;
            }

            if (item.properties && item.properties.length > 0) {
                const properties = item.properties.map(prop => prop.name).join(', ');
                itemInfo += `**Eigenschaften:** ${properties}\n`;
            }

            if (item.cost) {
                itemInfo += `**Kosten:** ${item.cost.quantity} ${item.cost.unit}\n`;
            }

            if (item.weight) {
                itemInfo += `**Gewicht:** ${item.weight} Pfund\n`;
            }

            const urlItem = itemName.toLowerCase().replace(/ /g, '%20'); 
            const embed = {
                title: item.name,
                description: itemInfo,
                url: "https://roll20.net/compendium/dnd5e/"+urlItem, 
                color: 0x00AE86
            };

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);

            if (error.response && error.response.status === 404) {
                await interaction.reply({ content: 'Item wurde nicht gefunden', ephemeral: true });
            } else {

                await interaction.reply({ content: 'There was an error fetching the magical item data. Please try again later.', ephemeral: true });
            }
        }
    }
};
