class CCL {
    arrayLoop(array, func, ...args) {
        for (let i = 0; i < array.length; i++)
            for (let j = 0; j < array[i].length; j++)
                if (typeof array[i][j] == "number")
                    args = func(array, i, j, ...args);
    }

    findNeighboursCCL(array, i, j, linked) {
		let nextNum = 1;
		
        if (i == 0 || typeof array[i - 1][j] != "number") {
            if (j == 0 || typeof array[i][j - 1] != "number") {
                array[i][j] = nextNum;
                linked[nextNum] = [nextNum];
                nextNum++;

                return [linked, nextNum];
            }

            array[i][j] = array[i][j - 1];
            return [linked, nextNum];
        }

        if (j == 0 || typeof array[i][j - 1] != "number") {
            array[i][j] = array[i - 1][j];
            return [linked, nextNum];
        }

        let min = Math.min(array[i - 1][j], array[i][j - 1]);
        let max = Math.max(array[i - 1][j], array[i][j - 1]);

        array[i][j] = min;

        linked[max] = Array.from(new Set(linked[max].concat(linked[min])));
        linked[min] = Array.from(new Set(linked[min].concat(linked[max])));

        linked[max].forEach((item) => {
            linked[item] = Array.from(
                new Set(linked[item].concat(linked[min]))
            );
        });
        linked[min].forEach((item) => {
            linked[item] = Array.from(
                new Set(linked[item].concat(linked[min]))
            );
        });

        return [linked, nextNum];
    }

    makeAllArea(array, i, j, linked, background) {
        array[i][j] = Math.min(...linked[array[i][j]]);

        if (
            [0, array.length - 1].includes(i) ||
            [0, array[i].length - 1].includes(j)
        )
            background[array[i][j].toString()] = true;

        return [linked, background];
    }

    fillBackground(array, i, j, background) {
        if (background[array[i][j].toString()]) array[i][j] = 0;

        return [background];
    }

    ccl(fakeArray) {
        let tempArray = JSON.parse(JSON.stringify(fakeArray));

        let linked = [];
        let background = {};

        this.arrayLoop(tempArray, this.findNeighboursCCL, linked);
        this.arrayLoop(tempArray, this.makeAllArea, linked, background);
        this.arrayLoop(tempArray, this.fillBackground, background);

        return tempArray;
    }
}
