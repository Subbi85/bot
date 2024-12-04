module.exports = {
    name: 'summon',
    description: 'Verschiebt alle Mitglieder mit der Rolle "SPIELER" in einen bestimmten Voice-Channel',
    async execute(interaction) {
        // IDs der Rolle und des Ziel-Voice-Channels
        const roleID = '1307733147131052162'; 
        const voiceChannelID = '1277371674240745534';

        console.log("Ok, wir wollen Member beschwören...")

        try {
            // Hole die Rolle und den Voice-Channel basierend auf den IDs
            const zielRolle = interaction.guild.roles.cache.get(roleID);
            if (!zielRolle) {
                return await interaction.reply({ content: `Die Rolle mit der ID "${roleID}" wurde nicht gefunden.`, ephemeral: true });
            }

            const zielChannel = interaction.guild.channels.cache.get(voiceChannelID);
            if (!zielChannel || zielChannel.type !== 2) { // Typ 2 ist Voice-Channel
                return await interaction.reply({ content: `Der Voice-Channel mit der ID "${voiceChannelID}" wurde nicht gefunden oder ist kein Voice-Channel.`, ephemeral: true });
            }

            // Finde alle Mitglieder mit der Rolle, die in einem Voice-Channel sind
            const spielerMitglieder = interaction.guild.members.cache.filter(member =>
                member.roles.cache.has(zielRolle.id) && member.voice.channel
            );

            if (spielerMitglieder.size === 0) {
                return await interaction.reply({ content: 'Keine Mitglieder mit der Rolle "SPIELER" in einem Voice-Channel gefunden.', ephemeral: true });
            }

            // Verschieben der Mitglieder
            spielerMitglieder.forEach(async member => {
                try {
                    await member.voice.setChannel(zielChannel);
                } catch (error) {
                    console.error(`Fehler beim Verschieben von ${member.user.tag}:`, error);
                }
            });

            await interaction.reply(`Alle Mitglieder mit der Rolle "${zielRolle.name}" wurden in den Channel "${zielChannel.name}" verschoben.`);
        } catch (error) {
            console.error('Fehler beim Verschieben der Mitglieder:', error);
            await interaction.reply({ content: 'Ein Fehler ist aufgetreten. Bitte überprüfe die IDs und die Berechtigungen.', ephemeral: true });
        }
    }
};
