"use strict"

class ID{
    constructor(auction_id){
        this.auction_id=auction_id
    }
    toString(){
        return `<ItemID>${this.auction_id}</ItemID>`
    }
}

module.exports = ID