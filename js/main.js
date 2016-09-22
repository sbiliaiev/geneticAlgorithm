var gen = angular.module('gen', []);

gen.controller('Main', ['$scope', function($scope) {
    console.log('its main controller');

    $scope.statistic = {};
    $scope.statistic = statistic;
    // console.log('here', $scope.statistic.fitness[4]);
    $scope.getTotal = function(what){
        if (what !== undefined) {
            var total = 0;
            for(var i = 0; i < what.length; i++){
                total += +what[i];
            }
            return total;
        }
    };

    $scope.maxArray = [];
    var check = function() {
        var l = $scope.maxArray.length;
        if ($scope.maxArray[l-1] === $scope.maxArray[l-2] && $scope.maxArray[l-1] === $scope.maxArray[l-3] && $scope.maxArray[l-1] !== null)
            return false;
        else
            return true;
    };

    $scope.startGen = function() {
        $scope.statistic.budget = +$scope.budgetField;
        $scope.statistic.size = +$scope.sizeField;
        console.log($scope.budgetField);

        var pop = new Population($scope.statistic);
        pop.init();
        // pop.sort();
        do {
            pop.crossover();
            pop.sort();
            pop.selection();
            $scope.maxArray.push(pop.populationArray[0].bigFit);
            console.log('here', pop);
        } while(check());
        $scope.best = pop.populationArray[0];
    };

}]);
