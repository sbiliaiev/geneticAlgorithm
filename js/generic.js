'use strict'
var limit = 20,	//ограничение на х
	limitLength = (limit*100).toString(2).length,	//перевод ограничения в бинарный вид
	bestFitnessArray = [],	//массив для хранение последних трех максимумов
	out = '';	//строка для вывода всего на экран

var Chromosome = function() {	//класс Хромосома
	var random = function(limit) {	//функция рандома, используется только на моменте инициализации
		var max = limit, 	//создание верхней границы
		min = -1 *limit;	//нижней границы
		return +(Math.random()*(max-min) + min).toFixed(2);	//генерация случайного числа в пределе верхней и нижней границы, округление до двух знаков после запятой
	}

	this.toDecimal = function(binary) {	//перевод бинарного в десятичный
		var flag = binary.substr(0, 1);	//вырезание первого символа (+ или -)
		var number = flag == '-' ? +(parseInt(binary, 2) / 100).toFixed(2) : +(parseInt(binary, 2) / 100).toFixed(2);//перевод в десятичный вид, умножение на -1 если в начале стоял -
		return number;	//возврещение этого числа
	};

	var toBinary = function(decimal) {	//перевод бинарного в десятичный
		var binary = (+(decimal*100).toFixed(0)).toString(2);	//умножаем на 100 и переводим в бинарный
		if (binary.charAt(0) == '-')	//если в начале стоит минус, вырезаем его (+ по умолчание не ставится)
			binary = binary.substr(1);	//копируем бинарное число без вырезанного минуса
		while (binary.length < limitLength)	//цикл чтобы дозаписать в начало необходимое количество нулей
			binary = '0'.concat(binary);	//дозаписываем нули, чтобы длина была 11
		binary = decimal > 0 ? '+'.concat(binary) : '-'.concat(binary);	//записываем в начале - или + в зависимости от знака десятичного числа
		return binary;	//возврщаем готовое бинарное число
	};

	this.fitnessFunc = function(x1, x2) {	//variant 13
		return +(1/( ( (x1*x1 + x2*x2) / 200 ) - Math.cos(x1)*Math.cos(x2/Math.sqrt(2)) + 2 )).toFixed(6);	//сама функция
	};

	this.init = function(limit) {	//инициализация
		console.log('limit is', limitLength, typeof limitLength);
		var x1decimal, x2decimal, x1binary, x2binary;	//создание локальных переменных
		x1decimal = random(limit);	//рандомим первое десятичное число
		x2decimal = random(limit);	//рандомим второе десятичное число
		x1binary = toBinary(x1decimal);	//переводим х1 в бинарный вид
		x2binary = toBinary(x2decimal);	//переводим х2 в бинарный вид
		
		this.x1decimal = x1decimal;	//делаем так, чтобы
		this.x2decimal = x2decimal;	//эти переменные
		this.x1binary = x1binary;	//можно было
		this.x2binary = x2binary;	//получить снаружи
		this.fitness = this.fitnessFunc(x1decimal, x2decimal);	//расчет фитнесс-функции
	};
};	//конец класса Хромосома

var Population = function(size) {	//класс Популяция
	var populationArray = [],	//массив для первоначальных популяций
		newPopulation = [];	//массив для работы: parents + children + mutants

	this.sort = function() {	//функция сортировки
		newPopulation = newPopulation.sort(function(a, b) {
			return b.fitness-a.fitness;	//сравнивает значения фитнесс-функций элементов
		});
	};

	this.print = function(arrayName) {	//фунция вывода на экран
		if (arrayName == 'populationArray') {
			out += '<br>POPULATION ARRAY<br>';
			for (var i = 0; i < populationArray.length; i++) {
				out += i+' { x1decimal= '+populationArray[i].x1decimal+', x2decimal= '+populationArray[i].x2decimal+
				', x1binary= '+populationArray[i].x1binary+', x2binary= '+populationArray[i].x2binary+', fitness= '+populationArray[i].fitness+' }<br>';
			}
		}
		else if (arrayName == 'newPopulation') {
			out += '<br>NEW POPULATION ARRAY<br>';
			for (var i = 0; i < newPopulation.length; i++) {
				out += i+' { x1decimal= '+newPopulation[i].x1decimal+', x2decimal= '+newPopulation[i].x2decimal+
				', x1binary= '+newPopulation[i].x1binary+', x2binary= '+newPopulation[i].x2binary+', fitness= '+newPopulation[i].fitness+' }<br>';
			}
		}
	};

	this.selection = function() {	//функция отбора лучших
		return newPopulation.slice(0, size);	//выбирает от нуля до размера популяции
	};	//в случае размера популяции 100 - возьмет 100 первых

	this.crossover = function() {	//функция кроссовера
		newPopulation = populationArray.slice(0, populationArray.length);	//копирование первоначальной популяции
		console.log('new population with length = ' + newPopulation.length+' is', newPopulation, '\n\nCROSSOVER BEGIN');
		out += '<br>CROSSOVER BEGIN';
		
		for (var i = 0; i < size/2; i++) {	//цикл размером на половину популяции
			//выбор родителей ПАНМИКСИЯ
			console.log('\niteration', i);
			out += '<br>iteration '+i;
			var parentIndex1 = +(Math.random()*(populationArray.length-1)).toFixed(0),	//генерируем случайные
				parentIndex2 = +(Math.random()*(populationArray.length-1)).toFixed(0);	//индексы для двух родителей
			console.log('parents are with index ', parentIndex1, parentIndex2);
			out += '<br>parents are with index'+parentIndex1+', '+parentIndex2;
			
			var parent1 = populationArray[parentIndex1],	//получаем этих
				parent2 = populationArray[parentIndex2];	//родителей из массива популяции
			console.log('parents are ', parent1, parent2);
			out += '<br>parents are:<br>1) x1= '+parent1.x1binary+', x2= '+parent1.x2binary;
			out += '<br>2) x1= '+parent2.x1binary+', x2= '+parent2.x2binary;

			//ОДНОТОЧЕЧНЫЙ КРОССОВЕР
			var pivot = +(Math.random()*(10 - 2) + 2).toFixed(0);	//генерация точки разрыва
			console.log('pivot', pivot);
			out += '<br>pivot '+pivot;
			var child1 = new Chromosome(),	//создание первого
				child2 = new Chromosome();	//и второго ребенка
			
			child1.x1binary = parent1.x1binary.substr(0, pivot) + parent2.x1binary.substr(pivot, limitLength+1-pivot);	//склеивание х1 для первого ребенка
			child1.x2binary = parent1.x2binary.substr(0, pivot) + parent2.x2binary.substr(pivot, limitLength+1-pivot);	//склеивание х2 для первого ребенка
			child1.x1decimal = child1.toDecimal(child1.x1binary);	//перевод х1 в десятичный вид для первого ребенка
			child1.x2decimal = child1.toDecimal(child1.x2binary);	//перевод х2 в десятичный вид для первого ребенка
			child1.fitness = child1.fitnessFunc(child1.x1decimal, child1.x2decimal);	//расчет фитнесс функции первого ребенка

			child2.x1binary = parent2.x1binary.substr(0, pivot) + parent1.x1binary.substr(pivot, limitLength+1-pivot);	//склеивание х1 для второго ребенка
			child2.x2binary = parent2.x2binary.substr(0, pivot) + parent1.x2binary.substr(pivot, limitLength+1-pivot);	//склеивание х2 для второго ребенка
			child2.x1decimal = child2.toDecimal(child2.x1binary);	//перевод х1 в десятичный вид для второго ребенка
			child2.x2decimal = child2.toDecimal(child2.x2binary);	//перевод х2 в десятичный вид для второго ребенка
			child2.fitness = child2.fitnessFunc(child2.x1decimal, child2.x2decimal);	//расчет фитнесс функции второго ребенка
			
			console.log('children are ', child1, child2);
			out += '<br>children are:<br>1) x1= '+child1.x1binary+', x2= '+child1.x2binary;
			out += '<br>2) x1= '+child2.x1binary+', x2= '+child2.x2binary+'<br>';
			newPopulation.push(child1);	//добавляем в конец популяции
			newPopulation.push(child2);	//полученных детей
		}
		console.log('\n\nnewpopulation with length = '+newPopulation.length+' after crossover is', newPopulation);
	};

	this.mutate = function() {	//функция мутации
		console.log('\n\nMUTATION START');
		out += '<br>MUTATION BEGIN';
		for (var i = 0; i < newPopulation.length; i++) {	//цикл размером на размер массива (родители + дети после кроссовера)
			var tmp = Math.random().toFixed(2);	//генерация рандомного числа до двух знаков после запятой
			// console.log('random', tmp);
			if (tmp < 0.05) {	//если мутация сработала
				console.log('\nmutation on iteration', i);
				out += '<br>mutation on iteration '+i+'<br>';
				var randIndex = (Math.random()*(limitLength-1) + 1).toFixed(0);	//генерируем индекс для изменения бита
				
				var chr = new Chromosome();	//создаем хромосому
				chr.x1binary = newPopulation[i].x1binary;	//копируем в нее первоначальные х1 и х2, чтобы с ними можно было работать
				chr.x2binary = newPopulation[i].x2binary;	//из особи, которая попала под мутацию
				
				console.log('original chromosome:', chr);
				out += 'original chromosome<br>{ x1decimal= '+chr.x1decimal+', x2decimal= '+chr.x2decimal+
				', x1binary= '+chr.x1binary+', x2binary= '+chr.x2binary+', fitness= '+chr.fitness+' }<br>';
				console.log('taking the ' + randIndex + ' of x1 and x2 and changing it to opposite');
				out += 'taking the ' + randIndex + ' of x1 and x2 and changing it to opposite<br>'
		
				var tmpArray = chr.x1binary.split('');	//переводим х1бинарный из строки в массив
				tmpArray[randIndex] = tmpArray[randIndex] == '0' ? '1' : '0';	//заменяем нужный бит на противоположный
				chr.x1binary = tmpArray.join('');	//переводим массив обратнов  строку

				tmpArray = chr.x2binary.split('');	//переводим х2бинарный из строки в массив
				tmpArray[randIndex] = tmpArray[randIndex] == '0' ? '1' : '0';	//заменяем нужный бит на противоположный
				chr.x2binary = tmpArray.join('');	//переводим массив обратнов  строку

				chr.x1decimal = chr.toDecimal(chr.x1binary);	//переводим новые бинарные х1 и х2
				chr.x2decimal = chr.toDecimal(chr.x2binary);	//в десятичный вид
				chr.fitness = chr.fitnessFunc(chr.x1decimal, chr.x1decimal);	//расчитываем фитнесс функцию полученной особи

				console.log('so now the new mutated chromosome is ', chr);
				out += 'so now the new mutated chromosome is<br>{ x1decimal= '+chr.x1decimal+', x2decimal= '+chr.x2decimal+
				', x1binary= '+chr.x1binary+', x2binary= '+chr.x2binary+', fitness= '+chr.fitness+' }<br>';
				newPopulation.push(chr);	//добавляем полученного мутанта в конец массива популяции
			}	
		}
		console.log('\n\nafter mutation our newPopulation with length ' + newPopulation.length + ' is', newPopulation);
	};

	this.init = function() {	//функция инициализации
		for (var i=0; i<size; i++) {	//цикл на размер популяции
			var tmp = new Chromosome();	//создаем новую хромосому
			tmp.init(limit);	//и вызываем ее функцию инициализации (расписана вверху)
			populationArray.push(tmp);	//добавляем хромосому в массив популяции
		}
		console.log('ORIGINAL POPULTAION with length = ' + populationArray.length, populationArray);
	};
	
	this.addMax = function() {	//добавление максимума популяции
		var max = newPopulation[0].fitness;	//получаем максимум популяции
		if (bestFitnessArray.length == 0)	//если длина массива 0
			bestFitnessArray[0] = max;	//записываем на 0 индекс
		else if (bestFitnessArray.length == 1)	//если длина 1
			bestFitnessArray[1] = max;	//записываем на 1 индекс
		else if (bestFitnessArray.length == 2)	//если длина 2
			bestFitnessArray[2] = max;	//записываем на 2 индекс
		else if (bestFitnessArray.length == 3) {	//если длина 3
			bestFitnessArray[0] = bestFitnessArray[1];	//смещаем 1 и 2 элементы
			bestFitnessArray[1] = bestFitnessArray[2];	//на позицию назад
			bestFitnessArray[2] = max;	//и записывем в конец 
		}	//таким образом, будет хранится максимумы последних трех популяций
		console.log('bestFitnessArray', bestFitnessArray);
	}

	this.clone = function(array) {	//функция клонирования
		console.log('HERE YO', array.length,'population array', populationArray.length);
		for (var i = 0; i < array.length; i++) {	//цикл на размер популяции
			var chr = new Chromosome();	//создаем хромосому
			chr.x1binary = array[i].x1binary;	//заполняем ее
			chr.x2binary = array[i].x2binary;	//значениями
			chr.x1decimal = array[i].x1decimal;	//элементов
			chr.x2decimal = array[i].x2decimal;	//из переданного
			chr.fitness = array[i].fitness;	//массива
			populationArray.push(chr);	//добавляем эту хромосому в массив популяции
		}
		console.log('HERE YO', array.length,'population array', populationArray.length);
	}
};