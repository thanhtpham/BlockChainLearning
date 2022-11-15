// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Greetings {
    string public message;

    function init() public {
        message = "Hello World!";
    }

    function setMessage(string memory _message) public {
        message = _message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}