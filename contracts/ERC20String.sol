pragma solidity >=0.5.0 <0.8.0;

import "./ERC20Base.sol";

contract ERC20String is ERC20Base {
    string public symbol;
    string public name;
    uint8 public decimals;

    constructor(
        uint256 _initialAmount,
        string memory _tokenSymbol,
        string memory _tokenName,
        uint8 _decimalUnits
    ) ERC20Base(_initialAmount) {
        symbol = _tokenSymbol; // Set the symbol for display purposes
        name = _tokenName; // Set the name for display purposes
        decimals = _decimalUnits; // Amount of decimals for display purposes
    }
}
