var statistic = {
    min : [ 431.97,
            225.54,
            101.43,
            97.65,
            69.58,
            60.06,
            581.56,
            358.19,
            29.05,
            15.96,
            5.95,
            408.59,
            230.93,
            88.41,
            45.64,
            18.27,
            470.40,
            84.70,
            72.87,
            1.19,
            157.08,
            222.46,
            86.38,
            248.92,
            100.66,
            70.07,
            62.65,
            21.56,
            110.04,
            10.36,
            5.25,
            61.11,
            18.27,
            142.24],
    max : [ 771.38,
            402.75,
            181.13,
            174.38,
            124.25,
            107.25,
            1038.5,
            639.63,
            51.88,
            28.5,
            10.63,
            729.63,
            412.38,
            157.88,
            81.5,
            32.63,
            840,
            151.25,
            130.13,
            2.13,
            280.5,
            397.25,
            154.25,
            444.5,
            179.75,
            125.13,
            111.88,
            38.5,
            196.5,
            18.5,
            9.38,
            109.13,
            32.63,
            254],
    fitness : [ function(x) {   //1
                    return x+Math.sqrt(x+4)*0.07;
                },
                function(x) {   //2
                    return x+Math.sqrt(x+2)*0.05;
                },
                function(x) {   //3
                    return x+Math.sqrt(x+5)*0.05;
                },
                function(x) {   //4
                    return x+Math.sqrt(x+4)*0.05;
                },
                function(x) {   //5
                    return x+Math.sqrt(x+2)*0.05;
                },
                function(x) {   //6
                    return x+Math.sqrt(x+4)*0.07;
                },
                function(x) {   //7
                    return x+Math.sqrt(x+6)*0.05;
                },
                function(x) {   //8
                    return x+Math.sqrt(x+4)*0.056;
                },
                function(x) {   //9
                    return x+Math.sqrt(x+2)*0.05;
                },
                function(x) {   //10
                    return x+Math.sqrt(x+4)*0.05;
                },
                function(x) {   //11
                    return x+Math.sqrt(x+6)*0.05;
                },
                function(x) {   //12
                    return x+Math.sqrt(x+4)*0.07;
                },
                function(x) {   //13
                    return x+Math.sqrt(x+6)*0.05;
                },
                function(x) {   //14
                    return x+Math.sqrt(x+4)*0.075;
                },
                function(x) {   //15
                    return x+Math.sqrt(x+4)*0.056;
                },
                function(x) {   //16
                    return x+Math.sqrt(x+6)*0.05;
                },
                function(x) {   //17
                    return x+Math.sqrt(x+4)*0.07;
                },
                function(x) {   //18
                    return x+Math.sqrt(x+5)*0.05;
                },
                function(x) {   //19
                    return x+Math.sqrt(x)*0.05;
                },
                function(x) {   //20
                    return x+Math.sqrt(x+4)*0.05;
                },
                function(x) {   //21
                    return x+Math.sqrt(x+4)*0.056;
                },
                function(x) {   //22
                    return x+Math.sqrt(x+5)*0.05;
                },
                function(x) {   //23
                    return x+Math.sqrt(x+4)*0.05;
                },
                function(x) {   //24
                    return x+Math.sqrt(x+6)*0.05;
                },
                function(x) {   //25
                    return x+Math.sqrt(x+4)*0.075;
                },
                function(x) {   //26
                    return x+Math.sqrt(x+4)*0.056;
                },
                function(x) {   //27
                    return x+Math.sqrt(x+4)*0.05;
                },
                function(x) {   //28
                    return x+Math.sqrt(x+5)*0.05;
                },
                function(x) {   //29
                    return x+Math.sqrt(x+4)*0.05;
                },
                function(x) {   //30
                    return x+Math.sqrt(x+4)*0.07;
                },
                function(x) {   //31
                    return x+Math.sqrt(x+6)*0.05;
                },
                function(x) {   //32
                    return x+Math.sqrt(x+4)*0.056;
                },
                function(x) {   //33
                    return x+Math.sqrt(x+4)*0.05;
                },
                function(x) {   //34
                    return x+Math.sqrt(x)*0.05;
                }]
};

var random = function(min, max, limit) {
    return +(Math.random()*(max-min)+min).toFixed(limit);
};

var Individual = function() {
    this.decimals = [];
    this.binaries = [];
    this.fitness = [];
    this.bigFit = 0;
};

Individual.prototype.init = function(params) {
    var workingLength = params.min.length,
        index,
        restOfBudget = params.budget;
    //заполняем первоначальными минимальными
    for (var i = 0; i < workingLength; i++) {
        this.decimals[i] = params.min[i];
        console.log();
        restOfBudget -= params.min[i];
        restOfBudget = restOfBudget.toFixed(2);
    }
    console.log('rest of budget', restOfBudget);

    while (restOfBudget > 0) {
        index = random(0, workingLength-1, 0);
        if (this.decimals[index] < params.max[index]) {
            // console.log('+ budget here', index);
            var tmp = random(0, params.max[index]-this.decimals[index], 2);
            if (tmp <= restOfBudget) {
                this.decimals[index] += tmp;
                restOfBudget -= tmp;
            } else {
                this.decimals[index] = tmp - restOfBudget;
                restOfBudget = 0;
            }
        }
    }
};

Individual.prototype.toBinary = function(params) {
    for (var i = 0; i < this.decimals.length; i++) {
        var current = (+(this.decimals[i]*100).toFixed(0)).toString(2),
            maximus = (+(params.max[i]*100).toFixed(0)).toString(2);
        while (maximus.length > current.length) {
            current = '0'.concat(current);
        }
        this.binaries[i] = current;
    }
};

Individual.prototype.toDecimal = function(params) {
    for (var i = 0; i < this.binaries.length; i++) {
        this.decimals[i] = +(parseInt(this.binaries[i], 2) / 100).toFixed(2);
    }
};

Individual.prototype.fitSum = function() {
    for (var i = 0; i < this.decimals.length; i++) {
        this.fitness[i] = statistic.fitness[i](this.decimals[i]);
        this.bigFit += this.fitness[i];
        this.bigFit = +this.bigFit.toFixed(2);
    }
};

Individual.prototype.getSum = function() {
   var sum = 0;
   for (var i = 0; i < this.decimals.length; i++) {
      sum += this.decimals[i];
   }
   return sum;
};
