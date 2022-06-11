class AreasManager {
    areasArray = [];
    constructor() {}

    getNeighbours(array, i, j) {
        return [
            array?.[i - 1]?.[j],
            array?.[i + 1]?.[j],
            array?.[i]?.[j - 1],
            array?.[i]?.[j + 1],
        ].filter((item) => item !== undefined);
    }

    makeArea(dotArray, next, first, area) {
        if (area.length == dotArray.length) {
            return area;
        }

        area.push(next);

        for (let i = 0; i < dotArray.length; i++) {
            if (
                Math.abs(next.dotColumn - dotArray[i].dotColumn) <= 1 &&
                Math.abs(next.dotRow - dotArray[i].dotRow) <= 1 &&
                !area.some((item) => item.id == dotArray[i].id)
            ) {
                return this.makeArea(dotArray, dotArray[i], first, area);
            }
        }
        return area;
    }

    findAllArea(array, side) {
        let areas = {};

        array.forEach((item1, i) => {
            item1.forEach((item2, j) => {
                if (typeof item2 == "object") {
                    let temp = this.getNeighbours(array, i, j, item2);
                    temp.forEach((item3) => {
                        if (typeof item3 == "number" && item3 > 0) {
                            if (!Array.isArray(areas[item3.toString()]))
                                areas[item3.toString()] = [];
                            if (
                                areas[item3.toString()].every(
                                    (item4) => item4.id != item2.id
                                )
                            )
                                areas[item3.toString()].push(item2);
                        }
                    });
                }
            });
        });

        areas = Object.entries(areas).map((item) =>
            item[1].filter((item2) => {
                let temp = this.getNeighbours(
                    array,
                    item2.dotRow - 1,
                    item2.dotColumn - 1
                );
                if (temp.length < 4) return true;

                return temp.some(
                    (item3) =>
                        (typeof item3 == "number" && item3 != item[0]) ||
                        (typeof item3 == "object" &&
                            !item[1].some((item5) => item5.id == item3.id))
                );
            })
        );

        areas = areas
            .filter((item) => item.length > 0)
            .map((item) => {
                let temp = false;
                for (let i = 1; i < item.length || !temp; i++)
                    if (
                        Math.abs(item[i].dotColumn - item[0].dotColumn) <= 1 &&
                        Math.abs(item[i].dotRow - item[0].dotRow) <= 1
                    )
                        temp = item[i];

                return this.makeArea(item, temp, item[0], [item[0]]);
            });

        areas.forEach((item) => this.areasArray.push(new Area(item, side)));
    }

    draw(ctx) {
        this.areasArray.forEach((item) => {
            item.draw(ctx);
        });
    }
}
