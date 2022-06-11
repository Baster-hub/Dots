class Area {
    dotsArray;
    side;
    constructor(array, side) {
        this.dotsArray = array;
        this.side = side;
    }

    draw(ctx) {
        ctx.globalAlpha = 0.3;

        ctx.fillStyle = this.side;
        ctx.strokeStyle = this.side;

        ctx.beginPath();
        ctx.moveTo(
            this.dotsArray[this.dotsArray.length - 1].dotColumn *
                this.dotsArray[this.dotsArray.length - 1].DBC,
            this.dotsArray[this.dotsArray.length - 1].dotRow *
                this.dotsArray[this.dotsArray.length - 1].DBC
        );
        
        this.dotsArray.forEach((item) => {
            ctx.lineTo(item.dotColumn * item.DBC, item.dotRow * item.DBC);
        });
        
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();

    }
}
