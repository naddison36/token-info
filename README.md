# Ethereum Token (ERC20) Information

## Get `symbol` and `name` properties from Ethereum contracts

-   checks if contract code exists at the address. If not, return blank `symbol` and `name` values.
-   return `symbol` and `name` as a string. This means converting `bytes32` to `string` for some tokens. eg [Maker](https://etherscan.io/address/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2)
-   Do not fail the call if the `symbol` or `name` does not exists on the contract. Catch the failure and return a blank string.
-   Get token details for a list of contracts. This allows one network round trip to try and get token details from an array of contract addresses. The call will not fail if one of the contracts in the list is not a token with `symbol` and `name`.

### Solidity interface

```solidity
struct Info {
    string symbol;
    string name;
}
function getInfo(address token) external view returns (Info memory info)
function getInfoBatch(address[] memory tokens) external view returns (Info[] memory infos)
```

# Deployed contracts

-   Mainnet [0xbA51331Bf89570F3f55BC26394fcCA05d4063C71](https://etherscan.io/address/0xba51331bf89570f3f55bc26394fcca05d4063c71)
-   Ropsten [0x3C982D14A1Ff95Fe504fF8C329e8eAb187201492](https://ropsten.etherscan.io/address/0x3C982D14A1Ff95Fe504fF8C329e8eAb187201492)

# Development

HardHat is used to compile the contracts.

```
npx hardhat compile
```

The main contract is [TokenInfo](./contracts/TokenInfo.sol). The other contracts are there for testing.

The HardHat config is [hardhat.config.ts](./hardhat.config.ts).

# Testing

## A fork of Mainnet

Run a forked mainnet node locally on port 7545

```
export ETH_NODE=https://mainnet.infura.io/v3/yourApiKey // infura
# OR
export ETH_NODE=https://eth-ropsten.alchemyapi.io/v2/yourApiKey // Alchemy
npx hardhat node --fork $ETH_NODE --port 7545
npx hardhat --network fork test ./test/tokenInfoFork.test.ts
```

## Mainnet

Run the mainnet tests against Ropsten

```
export ETH_NODE=https://ropsten.infura.io/v3/yourApiKey // infura
# OR
export ETH_NODE=https://eth-mainnet.alchemyapi.io/v2/yourApiKey // Alchemy
npx hardhat --network mainnet test ./test/tokenInfoMainnet.test.ts
```

## Ropsten

Run the mainnet tests against Ropsten

```
export ETH_NODE=https://mainnet.infura.io/v3/yourApiKey // infura
# OR
export ETH_NODE=https://eth-ropsten.alchemyapi.io/v2/yourApiKey // Alchemy
npx hardhat --network ropsten test ./test/tokenInfoRopsten.test.ts
```

# For later iterations

-   Get token balance to 18 decimals places.
-   Get token supply to 18 decimal places.

Different tokens have different decimal places so the balance and supply methods will convert all token balances to 18 decimal places. If a token has no decimal places then it is multiplied by 10**18. If a token has 6 decimal places, then the balance will be multiplied by 10**12
