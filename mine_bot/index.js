const mineflayer = require('mineflayer')
const vec3 = require('vec3')
const inventoryViewer = require('mineflayer-web-inventory')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const armorManager = require('mineflayer-armor-manager')
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock

const bot = mineflayer.createBot({
    host: process.argv[2] || 'localhost',
    port: process.argv[3],
    username: process.argv[4] || 'mine_bot',
    password: process.argv[5],
    logErrors: false
})

bot.loadPlugin(pathfinder)
bot.loadPlugin(armorManager)

bot.once('spawn', () => {
    inventoryViewer(bot)
    console.log('Bot joined!')
    console.log('Bot version: ' + bot.version)
    mineflayerViewer(bot, { port: 3001, firstPerson: true })
})

bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return

    setTimeout(() => {
        const sword = bot.inventory.items().find(item => item.name.includes('totem'))
        if (sword) bot.equip(sword, 'off-hand')
    }, 250)
})

bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return

    setTimeout(() => {
        const sword = bot.inventory.items().find(item => item.name.includes('pickaxe'))
        if (sword) bot.equip(sword, 'hand')
    }, 150)
})

function lookAtNearestPlayer(){
    const playerFilter = (entity) => entity.type === 'player'
    const playerEntity = bot.nearestEntity(playerFilter)

    if(!playerEntity) return

    const pos = playerEntity.position.offset(0, playerEntity.height, 0)
    bot.lookAt(pos)
}

bot.on('physicTick', lookAtNearestPlayer)

async function depositLoop() {
	let chestBlock = bot.findBlock({
		matching: mcData.blocksByName['chest'].id,
	});

	if (!chestBlock) return;

	if (bot.entity.position.distanceTo(chestBlock.position) < 2) {
		bot.setControlState('forward', false);

		let chest = await bot.openChest(chestBlock);

		for (slot of bot.inventory.slots) {
			if (slot && slot.name == harvestName) {
				await chest.deposit(slot.type, null, slot.count);
			}
		}
		chest.close();
	} else {
		bot.lookAt(chestBlock.position);
		bot.setControlState('forward', true);
	}
}

bot.on('whisper', (username, message)=>{
	let tokens = message.split(' ');
	switch(tokens[0]) {
		// case 'bed':
		// 	bedPosition = vec3(parseInt(tokens[1]), parseInt(tokens[2]), parseInt(tokens[3]));
		// 	break;
		case 'chest':
			chestPosition = vec3(parseInt(tokens[1]), parseInt(tokens[2]), parseInt(tokens[3]))
            console.log('New chest location: ' + chestPosition)
			break
	}
});
