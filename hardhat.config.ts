import "@nomiclabs/hardhat-ethers"
import "@unipeer/hardhat-typechain"

const ethereumNodeUrl = process.env.ETH_NODE
console.log(`Using ethereum node with url ${ethereumNodeUrl}`)

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks: {
        hardhat: { allowUnlimitedContractSize: true },
        localhost: { url: "http://localhost:8545" },
        mainnet: { url: ethereumNodeUrl },
        ropsten: { url: ethereumNodeUrl },
        fork: { url: "http://localhost:7545" },
    },
    solidity: "0.7.6",
    typechain: {
        outDir: "types",
        target: "ethers-v5",
        runOnCompile: true,
    },
    mocha: {
        timeout: 20000,
    },
}
