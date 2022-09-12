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
