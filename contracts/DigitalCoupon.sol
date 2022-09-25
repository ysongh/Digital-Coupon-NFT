// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import { ByteHasher } from './helpers/ByteHasher.sol';
import { IWorldID } from './interfaces/IWorldID.sol';

contract DigitalCoupon is ERC721URIStorage {  
    using ByteHasher for bytes;

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The WorldID instance that will be used for verifying proofs
    IWorldID internal immutable worldId;

    /// @dev The WorldID group ID (1)
    uint256 internal immutable groupId = 1;

    string public actionId = "";

    using Counters for Counters.Counter;
    Counters.Counter public _receiptIds;

    uint public totalCoupon = 0;

    mapping(uint => Coupon) public couponList;
    mapping(address => mapping(uint => Referrer)) public referrersList;

    struct Coupon {
        uint couponId;
        string cid;
        string tablelandId;
        uint expireDate;
        uint price;
        uint rewardPercentAmount;
        address owner;
    }

    struct Referrer {
        uint couponId;
        uint256 nullifierHash;
    }

    event CouponCreated (uint couponId, string cid, uint expireDate, uint price, uint rewardPercentAmount, address owner);
    event CouponSale (uint couponId, string cid, uint nftid, address referrer, address buyer);

    /// @param _worldId The WorldID instance that will verify the proofs
    constructor(IWorldID _worldId) ERC721("Digital Coupon Receipt", "DCR") {
        worldId = _worldId;

        createCoupon("https://dweb.link/ipfs/bafybeihcfd2bojowzxy6frpl54xqyt6cpk2wlp52avpetgj7yrcgx3m7ky", 7, 1000000000000000000, 10);
        createCoupon("https://dweb.link/ipfs/bafybeigqj4in4bpiovytwo6ubsjc2myek6psciscszyozch3jlzs2hv3ra", 10, 1500000000000000000, 10);
    }

    function createCoupon(string memory _cid, uint _timeAmount, uint _price, uint _rewardPercentAmount) public returns (uint) {
        uint _expireDate = block.timestamp + _timeAmount * 1 days;

        couponList[totalCoupon] = Coupon(totalCoupon, _cid, "", _expireDate, _price, _rewardPercentAmount, msg.sender);
        emit CouponCreated(totalCoupon, _cid, _expireDate, _price, _rewardPercentAmount, msg.sender);
        totalCoupon++;

        return totalCoupon - 1;
    }

    function createReferrer(address input, uint256 root, uint256 _nullifierHash, uint256[8] calldata proof, uint _couponId) external {
        // Verify they're registered with WorldID, and the input they've provided is correct
        // worldId.verifyProof(
        //     root,
        //     groupId,
        //     abi.encodePacked(input).hashToField(),
        //     _nullifierHash,
        //     abi.encodePacked(actionId).hashToField(),
        //     proof
        // );
        referrersList[msg.sender][_couponId] = Referrer(_couponId, _nullifierHash);
    }

    function setTablelandId(uint _id, string memory _tablelandId) public {
        Coupon storage currentCoupon = couponList[_id];
        currentCoupon.tablelandId = _tablelandId;
    }

    function purchaseWithReferrer(uint _couponId, address _referrerAddress, string memory _cid, uint256 _nullifierHash) external payable {
        Referrer storage _currentReferrer = referrersList[_referrerAddress][_couponId];

        // Should not use the referrer code for themselve
        if (_currentReferrer.nullifierHash == _nullifierHash) revert InvalidNullifier();

        Coupon memory currentCoupon = couponList[_couponId];
        uint toAmount = (currentCoupon.price * currentCoupon.rewardPercentAmount) / 100;
        uint ownerAmount = currentCoupon.price - toAmount;

        payable(currentCoupon.owner).transfer(ownerAmount);
        payable(_referrerAddress).transfer(toAmount / 2);

        _receiptIds.increment();
        uint256 currentId = _receiptIds.current();
        _mint(msg.sender, currentId);
        _setTokenURI(currentId, _cid);

        emit CouponSale(_couponId, _cid, currentId, _referrerAddress, msg.sender);
    }

    function getCoupons() public view returns (Coupon[] memory){
        Coupon[] memory coupons = new Coupon[](totalCoupon);

        for (uint i = 0; i < totalCoupon; i++) {
            Coupon memory currentCoupon = couponList[i];
            coupons[i] = currentCoupon;
        }

        return coupons;
    }

    function getOwnerCoupons(address _ownerAddress) public view returns (Coupon[] memory) {
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalCoupon; i++) {
            if (couponList[i].owner == _ownerAddress) {
                itemCount += 1;
            }
        }

        Coupon[] memory coupons = new Coupon[](itemCount);

        for (uint i = 0; i < totalCoupon; i++) {
            if (couponList[i].owner == _ownerAddress) {
                uint currentId = i;
                Coupon memory currentCoupon = couponList[currentId];
                coupons[currentIndex] = currentCoupon;
                currentIndex += 1;
            }
        }

        return coupons;   
    }
}
