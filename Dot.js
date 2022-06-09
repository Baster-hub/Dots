class Dot {
    dotColumn;
    dotRow;
    dotRadius;
    DBC;
    id;
    canUse = true;
    isSurrounded = false;

    constructor(column, row, radius, id, DBC) {
        this.dotColumn = column;
        this.dotRow = row;
        this.dotRadius = radius;
        this.id = id;
        this.DBC = DBC;
    }

    getX() {
        return this.dotColumn * this.DBC;
    }

    getY() {
        return this.dotRow * this.DBC;
    }

    check(array) {
        let temp = array[this.dotRow - 1][this.dotColumn - 1];

        if (typeof temp == "number" && temp > 0) this.canUse = false;
        this.isSurrounded = !(typeof temp == "number" && temp > 0);

        return this.isSurrounded;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.getX(), this.getY(), this.dotRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}
