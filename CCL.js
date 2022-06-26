class CCL {
    arrayLoop(array, func, ...args) {
        for (let i = 0; i < array.length; i++)
            for (let j = 0; j < array[i].length; j++)
                if (typeof array[i][j] == "number")
                    args = func(array, i, j, ...args);
    }

    findNeighboursCCL(array, i, j, linked, nextNum) {
        if (i == 0 || typeof array[i - 1][j] != "number") {
            if (j == 0 || typeof array[i][j - 1] != "number") {
                array[i][j] = nextNum;
                linked[nextNum.toString()] = nextNum;
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

        let min = Math.min(array[i - 1][j].toString(), array[i][j - 1].toString());
        let max = Math.max(array[i - 1][j].toString(), array[i][j - 1].toString());

        array[i][j] = min;

        let linkMin = Math.min(linked[min.toString()], linked[max.toString()]);
        let linkMax = Math.max(linked[min.toString()], linked[max.toString()]);

        Object.keys(linked).forEach((item) => {
            if (linked[item] == linkMax) linked[item] = linkMin;
        });

        return [linked, nextNum];
    }

    makeAllArea(array, i, j, linked, background) {
        array[i][j] = linked[array[i][j].toString()];

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

    findGrid(fakeArray) {
        let tempArray = JSON.parse(JSON.stringify(fakeArray));

        let linked = {};
        let background = {};
        let nextNum = 1;

        this.arrayLoop(tempArray, this.findNeighboursCCL, linked, nextNum);
        this.arrayLoop(tempArray, this.makeAllArea, linked, background);
        this.arrayLoop(tempArray, this.fillBackground, background);

        return tempArray;
    }
}
