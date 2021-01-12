import { ethers } from "hardhat"
import { Contract, ContractFactory, Signer } from "ethers"
import { ERC20Base, ERC20Bytes32, ERC20String, TokenInfo } from "../types"
import { expect } from "chai"

const makerAddress = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
const uniswapAddress = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"

describe("Fork Token Info", () => {
    let accounts: Signer[]
    let ERC20StringFactory: ContractFactory
    let ERC20Bytes32Factory: ContractFactory
    let erc20String: ERC20String
    let erc20Bytes32: ERC20Bytes32
    let erc20Base: ERC20Base
    let tokenInfo: TokenInfo

    before(async () => {
        accounts = await ethers.getSigners()

        const tokenInfoFactory = await ethers.getContractFactory("TokenInfo")
        tokenInfo = (await tokenInfoFactory.deploy()) as TokenInfo

        // Deploy token with symbol and name of string type
        ERC20StringFactory = await ethers.getContractFactory("ERC20String")
        erc20String = (await ERC20StringFactory.deploy(
            1000,
            "STR",
            "String Name",
            18
        )) as ERC20String
        await erc20String.deployed()

        // Deploy token with symbol and name of bytes32 type
        ERC20Bytes32Factory = await ethers.getContractFactory("ERC20Bytes32")
        erc20Bytes32 = (await ERC20Bytes32Factory.deploy(
            2000,
            ethers.utils.formatBytes32String("BYTS"),
            ethers.utils.formatBytes32String("Bytes Name"),
            0
        )) as ERC20Bytes32
        await erc20Bytes32.deployed()

        // Deploy token with no symbol and name properties
        const erc20BaseFactory = await ethers.getContractFactory("ERC20Base")
        erc20Base = (await erc20BaseFactory.deploy(2000)) as ERC20Bytes32
        await erc20Base.deployed()
    })

    describe("getInfo", () => {
        it("Get info from string token", async () => {
            const result = await tokenInfo.getInfo(erc20String.address)
            expect(result.symbol).to.eq("STR")
            expect(result.name).to.eq("String Name")
        })
        it("Get info from bytes32 token", async () => {
            const result = await tokenInfo.getInfo(erc20Bytes32.address)
            expect(result.symbol).to.eq("BYTS")
            expect(result.name).to.eq("Bytes Name")
        })
        it("Get info from token with no symbol or name", async () => {
            const result = await tokenInfo.getInfo(erc20Base.address)
            expect(result.symbol).to.eq("")
            expect(result.name).to.eq("")
        })
        it("Get info from externally owned account", async () => {
            const result = await tokenInfo.getInfo(
                await accounts[0].getAddress()
            )
            expect(result.symbol).to.eq("")
            expect(result.name).to.eq("")
        })
        it("Get info with emoji's in string", async () => {
            const erc20 = (await ERC20StringFactory.deploy(
                1000,
                "👍💩👏",
                "A name that is longer than 32 characters",
                18
            )) as ERC20String
            await erc20.deployed()
            const result = await tokenInfo.getInfo(erc20.address)
            expect(result.symbol).to.eq("👍💩👏")
            expect(result.name).to.eq(
                "A name that is longer than 32 characters"
            )
        })
        it("Get info with emoji's in bytes32", async () => {
            const erc20 = (await ERC20Bytes32Factory.deploy(
                1000,
                ethers.utils.formatBytes32String("👍💩👏"),
                ethers.utils.formatBytes32String(
                    "A name that is thirty one longs"
                ),
                18
            )) as ERC20String
            await erc20.deployed()
            const result = await tokenInfo.getInfo(erc20.address)
            expect(result.symbol).to.eq("👍💩👏")
            expect(result.name).to.eq("A name that is thirty one longs")
        })
        it("Get Uniswap info on mainnet which is string format", async () => {
            const result = await tokenInfo.getInfo(uniswapAddress)
            expect(result.symbol).to.eq("UNI")
            expect(result.name).to.eq("Uniswap")
        })
        it("Get Maker DAO info on mainnet which is bytes32 format", async () => {
            const result = await tokenInfo.getInfo(makerAddress)
            expect(result.symbol).to.eq("MKR")
            expect(result.name).to.eq("Maker")
        })
    })
    describe("Get infos", () => {
        it("Get infos", async () => {
            const result = await tokenInfo.getInfoBatch([
                erc20String.address,
                erc20Bytes32.address,
                erc20Base.address,
                await accounts[1].getAddress(),
                makerAddress,
                uniswapAddress,
            ])
            expect(result).to.have.length(6)
            expect(result[0].symbol).to.eq("STR")
            expect(result[0].name).to.eq("String Name")
            expect(result[1].symbol).to.eq("BYTS")
            expect(result[1].name).to.eq("Bytes Name")
            expect(result[2].symbol).to.eq("")
            expect(result[2].name).to.eq("")
            expect(result[3].symbol).to.eq("")
            expect(result[3].name).to.eq("")
            expect(result[4].symbol).to.eq("MKR")
            expect(result[4].name).to.eq("Maker")
            expect(result[5].symbol).to.eq("UNI")
            expect(result[5].name).to.eq("Uniswap")
        })
    })
})
