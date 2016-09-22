var Population = function(params) {
    this.populationArray = [];
    this.newPopulation = [];
    this.size = params.size;
    this.params = params;
};

Population.prototype.init = function() {
    for (var i = 0; i < this.size; i++) {
        var tmp = new Individual();
        tmp.init(this.params);
        tmp.fitSum();
        tmp.toBinary(this.params);
        this.populationArray.push(tmp);
    }
};

Population.prototype.sort = function() {
    this.newPopulation = this.newPopulation.sort(function(a, b) {
        return b.bigFit - a.bigFit;
    });
    this.populationArray = this.populationArray.sort(function(a, b) {
        return b.bigFit - a.bigFit;
    });
};

Population.prototype.selection = function() {
    this.populationArray = this.newPopulation.slice(0, this.size);
};

Population.prototype.crossover = function() {
    this.newPopulation = this.populationArray.slice(0, this.size);
    while (this.newPopulation.length < this.size*2) {
      var   parentIndex1 = random(0, this.size-1, 0),
            parentIndex2 = random(0, this.size-1, 0),
            parent1 = this.populationArray[parentIndex1],
            parent2 = this.populationArray[parentIndex2],
            child1 = new Individual(),
            child2 = new Individual();

            for (var j = 0; j < parent1.decimals.length; j ++) {
               var pivot = random(1, parent1.binaries[j].length, 0);
               child1.binaries[j] = parent1.binaries[j].substr(0, pivot) + parent2.binaries[j].substr(pivot, parent1.binaries[j].length+1-pivot);
               child2.binaries[j] = parent2.binaries[j].substr(0, pivot) + parent1.binaries[j].substr(pivot, parent1.binaries[j].length+1-pivot);
           }

           child1.toDecimal(this.params);
           child2.toDecimal(this.params);
           child1.fitSum();
           child2.fitSum();

           if (child1.getSum() <= this.params.budget){
             this.newPopulation.push(child1);
          }
          if (child2.getSum() <= this.params.budget){
            this.newPopulation.push(child2);
         }

   }
};
