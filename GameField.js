class GameField {
    #COLUMNS;
    #ROWS;
    #DBC;
    CIRCLE_RADIUS;
    width;
    height;

    constructor(columns, rows, distance_between_cells, canvas) {
        this.#COLUMNS = columns;
        this.#ROWS = rows;
        this.#DBC = distance_between_cells;

        this.CIRCLE_RADIUS = (this.#DBC * 2) / 6;

        this.width = canvas.width = (this.#COLUMNS + 1) * this.#DBC;
        this.height = canvas.height = (this.#ROWS + 1) * this.#DBC;
    }

    drawFieldCells(ctx) {
        ctx.strokeStyle = "black";
        ctx.globalAlpha = 0.7;

        ctx.beginPath();

        for (let x = 1; x <= this.#COLUMNS; x++) {
            ctx.moveTo(x * this.#DBC, this.#DBC);
            ctx.lineTo(x * this.#DBC, this.height - this.#DBC);
        }

        for (let y = 1; y <= this.#ROWS; y++) {
            ctx.moveTo(this.#DBC, y * this.#DBC);
            ctx.lineTo(this.width - this.#DBC, y * this.#DBC);
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    drawDotShadow(ctx, side, dotColumn, dotRow) {
        let dotX = dotColumn * this.#DBC;
        let dotY = dotRow * this.#DBC;

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = side;

        ctx.beginPath();
        ctx.arc(dotX, dotY, this.CIRCLE_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
    }

    draw(ctx, side, dotColumn, dotRow) {
        this.drawFieldCells(ctx);
        this.drawDotShadow(ctx, side, dotColumn, dotRow);
    }
}
