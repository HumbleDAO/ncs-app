/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')

if (!fs.existsSync('./contracts/hardhat_contracts.json')) {
    try {
        fs.writeFileSync('./contracts/hardhat_contracts.json', JSON.stringify({}))

        console.log('contracts/hardhat_contracts.json created.')
    } catch (error) {
        console.log(error)
    }
} else {
    console.log('contracts/hardhat_contracts.json exists!')
}
