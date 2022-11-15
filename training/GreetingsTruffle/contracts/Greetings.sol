// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Greetings {
    string public message;

    constructor(string memory _message) {
        message = _message;
    }

    function setMessage(string memory _message) public {
        message = _message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}