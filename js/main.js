'use strict'	//использовать строгий режим
var startGeneric = function() {	//главная функция, которую запускаем по неажатию кнопки
	console.log('the algorithm has begun');	
	var someBool = true,	//логическая переменная для остановки цикла
		counter = 1,	//счетчик количества популяций
		populationNumber;	//размер популяции
	function check() {	//функция для проверки завершения цикла
		if (bestFitnessArray[0] == bestFitnessArray[1] && bestFitnessArray[0] == bestFitnessArray[2] &&	bestFitnessArray[0] != null) {	//если три последних значения равны
			console.log('\nhorey the end is HERE\n');
			return false;	//вернуть false
		}
		else	//иначе
			return true;	//вернуть true
	}
	

	populationNumber = document.getElementById('popNumber').value;	//получить размер популяции из input-a

	out += '<br><br><b>POPULATION NUMBER 0</b>';	//вывод на экран
	var pop = new Population(populationNumber);	//создание первоначальной популяции с полученным размером
	pop.init();	//инициализация популяции
	pop.print('populationArray');	//вывод популяции на экран
	pop.crossover();	//применение кроссовера
	out += '<br>NEW POPULATION AFTER CROSSOVER';
	pop.print('newPopulation');
	pop.mutate();	//применение мутации
	pop.sort();	//сортировка, бОльшие - в начале
	out += '<br>AFTER CROSSOVER, MUTATION AND SORT POPULATION IS';
	pop.print('newPopulation');
	var tmpArray = [];	//создание массива для лучших индивидуумов
	tmpArray = pop.selection();	//элитный отбор
	pop.addMax();	//добавление максимального числа в последние три

	while(someBool == true) {	//цикл пока переменная равна true
		console.clear();
		console.log('\n\nPOPULATION NUMBER ' + counter);
		out += '<br><br><b>POPULATION NUMBER '+counter+'</b>';
		var newPop = new Population(populationNumber);	//создание новой популяции	такого же размера, как и прошлая
		newPop.clone(tmpArray);	//копирование лучших индивидов из прошлой популяции (передаем массив в качестве параметра)
		newPop.print('populationArray');	//вывод популяции на экран
		newPop.crossover();	//применение кроссовера
		out += '<br>NEW POPULATION AFTER CROSSOVER';
		newPop.print('newPopulation');
		newPop.mutate();	//мутация
		newPop.sort();	//сортировка, бОльшие в начале
		out += '<br>AFTER CROSSOVER, MUTATION AND SORT POPULATION IS';
		newPop.print('newPopulation');
		tmpArray = newPop.selection();	//копирование лучших индивидов
		newPop.addMax();	//добавление максимального числа в последние три
		someBool = check();	//проверка остановки
		counter++;	//увеличение счетчика популяций
		console.log(someBool);
	}
	var maxString = '<br>MAX IS '+bestFitnessArray[0]+' with population size '+populationNumber+' and '+counter+' populations';	//строчка для записи
	document.getElementById('codeBlock').innerHTML = out;	//вывод на экран
	document.getElementById('maxBlock').innerHTML = maxString;	//то же самое
};