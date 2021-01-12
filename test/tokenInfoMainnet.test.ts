import { ethers } from "hardhat"
import { Contract, ContractFactory, Signer } from "ethers"
import { TokenInfo } from "../types"
import { expect } from "chai"

const makerAddress = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
const uniswapAddress = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"

describe("Mainnet Token Info", () => {
    let ERC20StringFactory: ContractFactory
    let ERC20Bytes32Factory: ContractFactory
    let tokenInfo: TokenInfo

    before(async () => {
        const tokenInfoFactory = await ethers.getContractFactory("TokenInfo")
        tokenInfo = tokenInfoFactory
            .attach("0xbA51331Bf89570F3f55BC26394fcCA05d4063C71")
            .connect(ethers.provider) as TokenInfo

        // Deploy token with symbol and name of string type
        ERC20StringFactory = await ethers.getContractFactory("ERC20String")

        // Deploy token with symbol and name of bytes32 type
        ERC20Bytes32Factory = await ethers.getContractFactory("ERC20Bytes32")
    })

    describe("getInfo", () => {
        it("Get Uniswap symbol and name", async () => {
            const uniswap: Contract = ERC20StringFactory.attach(
                uniswapAddress
            ).connect(ethers.provider)
            const symbol = await uniswap.symbol()
            expect(symbol).to.eq("UNI")
            expect(await uniswap.name()).to.eq("Uniswap")
        })
        it("Get Uniswap info on mainnet which is string format", async () => {
            const result = await tokenInfo.getInfo(uniswapAddress)
            expect(result.symbol).to.eq("UNI")
            expect(result.name).to.eq("Uniswap")
        })
        it("Get Maker symbol and name", async () => {
            const maker: Contract = ERC20Bytes32Factory.attach(
                makerAddress
            ).connect(ethers.provider)
            const symbol = await maker.symbol()
            expect(symbol).to.eq(ethers.utils.formatBytes32String("MKR"))
            expect(await maker.name()).to.eq(
                ethers.utils.formatBytes32String("Maker")
            )
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
                makerAddress,
                uniswapAddress,
                "0xB10c853ff8151965E4BDea9A984E36254bA42956", // externally owned account
            ])
            expect(result).to.have.length(3)
            expect(result[0].symbol).to.eq("MKR")
            expect(result[0].name).to.eq("Maker")
            expect(result[1].symbol).to.eq("UNI")
            expect(result[1].name).to.eq("Uniswap")
            expect(result[2].symbol).to.eq("")
            expect(result[2].name).to.eq("")
        })
    })
})
