// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DigitalCouponV1 is ERC721URIStorage {  
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
        address[] users;
    }

    event CouponCreated (uint couponId, string cid, uint expireDate, uint price, uint rewardPercentAmount, address owner);
    event CouponSale (uint couponId, string cid, uint nftid, address referrer, address buyer);

    constructor() ERC721("Digital Coupon Receipt", "DCR") {}

    function createCoupon(string memory _cid, uint _timeAmount, uint _price, uint _rewardPercentAmount) public returns (uint) {
        uint _expireDate = block.timestamp + _timeAmount * 1 days;

        couponList[totalCoupon] = Coupon(totalCoupon, _cid, "", _expireDate, _price, _rewardPercentAmount, msg.sender);
        emit CouponCreated(totalCoupon, _cid, _expireDate, _price, _rewardPercentAmount, msg.sender);
        totalCoupon++;

        return totalCoupon - 1;
    }

    function createReferrer(uint _couponId) external {
        referrersList[msg.sender][_couponId] = Referrer(_couponId, new address[](0));
        referrersList[msg.sender][_couponId].users.push(msg.sender);
    }

    function setTablelandId(uint _id, string memory _tablelandId) public {
        Coupon storage currentCoupon = couponList[_id];
        currentCoupon.tablelandId = _tablelandId;
    }

    function addRefer(uint _couponId, address _referrerAddress) external {
        Referrer storage _currentReferrer = referrersList[_referrerAddress][_couponId];
        _currentReferrer.users.push(msg.sender);
    }

    function purchaseWithReferrer(uint _couponId, address _referrerAddress, string memory _cid) external payable {
        Coupon memory currentCoupon = couponList[_couponId];
        uint toAmount = (currentCoupon.price * currentCoupon.rewardPercentAmount) / 100;
        uint ownerAmount = currentCoupon.price - toAmount;

        payable(currentCoupon.owner).transfer(ownerAmount);
        payable(_referrerAddress).transfer(toAmount / 2);

        Referrer storage _currentReferrer = referrersList[_referrerAddress][_couponId];
        _currentReferrer.users.push(msg.sender);

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

    function getAddressFromReferrer(uint _couponId, address _referrerAddress) public view returns (address [] memory){
        Referrer memory _currentReferrer = referrersList[_referrerAddress][_couponId];
        return _currentReferrer.users;
    }

    // WARMING: Remove this on production
    function withdrawETH() external {
        payable(msg.sender).transfer(address(this).balance);
    }
}