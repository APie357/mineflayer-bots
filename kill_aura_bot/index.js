const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 46629,
    username: 'kill_aura_bot'
})

bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
    setInterval(() => {
        const mobFilter = e => e.type === 'mob' && e.mobType ==='Pillager'
        const mob = bot.nearestEntity(mobFilter)

        if (!mob) return

        const mcData = require('minecraft-data')(bot.version)
        const movements = new Movements(bot, mcData)
        movements.scafoldingBlocks = []

        bot.pathfinder.setMovements(movements)

        const goal = new GoalFollow(mob, 1)
        bot.pathfinder.setGoal(goal, true)
        const headpos = mob.position.offset(0, mob.height, 0)
        const pos = mob.position
        bot.lookAt(headpos, true, () => {
            bot.attack(mob)
        })
    }, 1000)
    
})
