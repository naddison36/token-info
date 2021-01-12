import { ethers } from "hardhat"
import { Contract, ContractFactory } from "ethers"
import { TokenInfo } from "../types"
import { expect } from "chai"

describe("Ropsten Token Info", () => {
    let ERC20StringFactory: ContractFactory
    let tokenInfo: TokenInfo

    before(async () => {
        const tokenInfoFactory = await ethers.getContractFactory("TokenInfo")
        tokenInfo = tokenInfoFactory
            .attach("0x3C982D14A1Ff95Fe504fF8C329e8eAb187201492")
            .connect(ethers.provider) as TokenInfo

        ERC20StringFactory = await ethers.getContractFactory("ERC20String")
    })
    it("Get block number", async () => {
        const blockNumber = await ethers.provider.getBlockNumber()
        console.log("Current block number: " + blockNumber)
    })
    describe("get token info", () => {
        it("Get Maker symbol and name", async () => {
            let maker: Contract = ERC20StringFactory.attach(
                "0x06732516acd125b6e83c127752ed5f027e1b276e"
            ).connect(ethers.provider)
            const symbol = await maker.symbol()
            expect(symbol).to.eq("MKR")
            expect(await maker.name()).to.eq("MakerDAO")
        })
        it("Get Maker DAO info which is bytes32 format", async () => {
            const result = await tokenInfo.getInfo(
                "0x06732516acd125b6e83c127752ed5f027e1b276e"
            )
            expect(result.symbol).to.eq("MKR")
            expect(result.name).to.eq("MakerDAO")
        })
    })
    describe("Get infos", () => {
        it("Get infos", async () => {
            const result = await tokenInfo.getInfoBatch([
                "0x06732516acd125b6e83c127752ed5f027e1b276e",
            ])
            expect(result).to.have.length(1)
            expect(result[0].symbol).to.eq("MKR")
            expect(result[0].name).to.eq("MakerDAO")
        })
    })
})
