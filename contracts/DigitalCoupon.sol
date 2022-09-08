// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract DigitalCoupon {  
    uint public totalCoupon = 0;

    mapping(uint => Coupon) public couponList;

    struct Coupon {
        uint tokenId;
        string cid;
        string tablelandId;
        address owner;
    }

    event CouponCreated (uint tokenId, string cid, address owner);

    constructor() {}

    function createCoupon(string memory _cid) public returns (uint) {
        couponList[totalCoupon] = Coupon(totalCoupon, _cid, "", msg.sender);
        emit CouponCreated(totalCoupon, _cid, msg.sender);
        totalCoupon++;

        return totalCoupon - 1;
    }

    function setTablelandId(uint _id, string memory _tablelandId) public {
        Coupon storage currentCoupon = couponList[_id];
        currentCoupon.tablelandId = _tablelandId;
    }

    function getCoupons() public view returns (Coupon[] memory){
        Coupon[] memory coupons = new Coupon[](totalCoupon);

        for (uint i = 0; i < totalCoupon; i++) {
            Coupon memory currentCoupon = couponList[i];
            coupons[i] = currentCoupon;
        }

        return coupons;
    }
}
