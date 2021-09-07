const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 33005,
    username: 'pathfind_bot'
})

bot.loadPlugin(pathfinder)

function followPlayer(){
    const playerCI = bot.players['APie357']

    if(!playerCI){
        bot.chat("I can't see the person I am trying to follow!")
        return
    }

    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    movements.scafoldingBlocks = []

    bot.pathfinder.setMovements(movements)

    const goal = new GoalFollow(playerCI.entity, 1)
    bot.pathfinder.setGoal(goal, true)
}

function locateEmeraldBlock(){
    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    movements.scafoldingBlocks = []

    bot.pathfinder.setMovements(movements)

    const emeraldBlock = bot.findBlock({
        matching: mcData.blocksByName.emerald_block.id,
        maxDistance: 32
    })

    if(!emeraldBlock){
        bot.chat("I can't find an emerald block!")
        return
    }

    const x = emeraldBlock.position.x
    const y = emeraldBlock.position.y + 1
    const z = emeraldBlock.position.z
    const goal = new GoalBlock(x, y, z)
    bot.pathfinder.setGoal(goal)
}

bot.once('spawn', locateEmeraldBlock)