pragma solidity >=0.5.0 <0.8.0;

import "./ERC20Base.sol";

contract ERC20Bytes32 is ERC20Base {
    bytes32 public symbol;
    bytes32 public name;
    uint8 public decimals;

    constructor(
        uint256 _initialAmount,
        bytes32 _tokenSymbol,
        bytes32 _tokenName,
        uint8 _decimalUnits
    ) ERC20Base(_initialAmount) {
        symbol = _tokenSymbol; // Set the symbol for display purposes
        name = _tokenName; // Set the name for display purposes
        decimals = _decimalUnits; // Amount of decimals for display purposes
    }
}
