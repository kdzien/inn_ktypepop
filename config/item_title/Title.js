"use strict"

class Title{
    constructor(title){
        this.title=title
    }
    toString(){
        return `<Title>${this.title}</Title>`
    }
}
module.exports = Title