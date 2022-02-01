'use strict'

let roundSlider = new RoundSlider();
roundSlider.initialization();

let question = new Questions();
question.showQuestion();

let topic = new Topic();
topic.showTopic();

let addContainer = new NewContent();
addContainer.initialization();

let players = document.getElementsByClassName('point-container');

let masha = new Player(players[0]);
masha.initialization();

let vova = new Player(players[1]);
vova.initialization();

let max = new Player(players[2]);
max.initialization();

//Конструктор объекта, который добавляет текст вопроса в поле вопроса
//По нажатию на на одну из ячеек сетки игры
function Questions() {
	this.questionButtons = document.getElementsByClassName('questionButton');
	this.closeButton = document.getElementById('closeButton');
	this.gameArea = document.getElementById('gameArea');
	this.questionArea = document.getElementById('questionArea');
	this.questionText = document.getElementById('questionText');
	this.questionImg = document.getElementById('questionImg');
	this.item = document.querySelectorAll('.item')
	this.buttonNumber = null;

	const gameAreaHeight = this.gameArea.offsetHeight;
	const gameAreaWidth = this.gameArea.offsetWidth;

	//Метод скрывающий/открывающий поля сетки игры и текста вопроса
	//и добавляющий, соответствующий нажатой ячейке, текст вопроса
	this.showQuestion = function() {
		let that = this;

		//Добавление addEventListener в цикле ко всем ячейкам сетки игры
		for(let i = 0; i < this.questionButtons.length; i++) {

			this.questionButtons[i].addEventListener('click', function(event) {
				that.counterRound = roundSlider.counterRound;	//Получение номера раунда из объекта roundSlider
				let buttonNumber;

				//Проверка браузера
				//Получение номера нажатой кнопки вопроса, через номер id из родительского элемента
				if(event.path) {
					buttonNumber = +event.path[2].id.slice(4) - 1;	//Для chromium, edge
				} else if(event.composedPath()) {
					buttonNumber = +event.composedPath()[2].id.slice(4) - 1;	//ХЗ
				} else {
					buttonNumber = +event.composedPath[2].id.slice(4) - 1;	//Для firefox
				}

				that.buttonNumber = buttonNumber;

				//Скрытие фона нажатого вопроса, чтобы при выходе он выглядел, как неактивный
				that.item[buttonNumber].classList.add('disabledQuestion')

				let topicNumber = getTopicInfo(buttonNumber, that.counterRound)[0];	//Получение номера темы, в которой нажата кнопка вопроса 

				//Скрытие поля сетки игры и открытие текста вопроса
				that.gameArea.style = 'display: none';
				that.questionArea.style = 'display: flex';

				//Проверка наличие темы в общем файле игры, при отсутсвии возвращает текст вопроса и прерывает функцию
				if(data[topicNumber] == undefined) {
					that.questionText.innerHTML = 'undefined';
					that.questionImg.removeAttribute("src");
					return;
				}

				let currentQuestionFromData = data[topicNumber].questions[getTopicInfo(buttonNumber, that.counterRound)[1]];
				let currentQuestionSetting = data[topicNumber].settings[getTopicInfo(buttonNumber, that.counterRound)[1] / 100];

				//Добавление текста или изображения вопроса из общего файла контента игры по номеру темы и номеру нажатой кнопки
				if(currentQuestionSetting == 'setting-img') {
					that.questionText.innerHTML = null;
					that.questionImg.style = `width: 0px; height: 0px;`;
					that.questionImg.src = currentQuestionFromData;

					if(that.questionImg.width >= that.questionImg.height) {
						that.questionImg.style = `height: ${gameAreaHeight}px; padding: 25px`;
					} else if(that.questionImg.width < that.questionImg.height) {
						that.questionImg.style = `width: ${gameAreaWidth}px; padding: 25px`;
					}

				} else {
					that.questionImg.removeAttribute("src");
					that.questionImg.style = 'padding: 0';
					currentQuestionSetting = null;
					that.questionText.innerHTML = currentQuestionFromData;
				}

				//Функция возвращающая массив из номера темы и номера нажатой кнопки
				//Номер темы определяется по номеру ряда кнопки и текущего раунда
				//Номер преобразуется в число типа '100', т.к. в таком виде хранятся ключи в объекте общего файла контента
				function getTopicInfo(buttonNumber, counterRound) {
					if(buttonNumber < 5) {
						return [(0 + 6 * that.counterRound), (buttonNumber + 1)*100];
					} else if(buttonNumber < 10) {
						return [(1 + 6 * that.counterRound), (buttonNumber - 4)*100];
					} else if(buttonNumber < 15) {
						return [(2 + 6 * that.counterRound), (buttonNumber - 9)*100];
					} else if(buttonNumber < 20) {
						return [(3 + 6 * that.counterRound), (buttonNumber - 14)*100];
					} else if(buttonNumber < 25) {
						return [(4 + 6 * that.counterRound), (buttonNumber - 19)*100];
					} else return [(5 + 6 * that.counterRound), (buttonNumber - 24)*100];
				}
			});
		}

		//Открытие поля сетки игры и скрытие текста вопроса
		this.closeButton.addEventListener('click', function(event) {
			that.gameArea.style = 'display: grid';
			that.questionArea.style = 'display: none';
		});
	}
}

//Конструктор объект, добавляющий названия тем в текущем раунде
function Topic() {
	this.topics = document.getElementsByClassName('topic');

	this.showTopic = function() {
		this.counterRound = roundSlider.counterRound; //Получение текущего раунда игры из объекта roundSlider

		//Присвоение названий тем через цикл соответсвующим элементам в HTML
		for(let i = 0; i < this.topics.length; i++) {
			let topicNumber = i + (0 + 6 * this.counterRound); //Второе слагаемое определяет номер темы, если есть переход в следующий раунд

			if(data[topicNumber] == undefined) {
				//this.topics[topicNumber].innerHTML = 'undefined';
				return;
			} else {
				this.topics[i].innerHTML = data[topicNumber].topicName;
			}
		}
	}
}

//Конструктор объекта слайдера переключения раундов
function RoundSlider() {
	this.prevButton = document.getElementById('showPrev');
	this.nextButton = document.getElementById('showNext');
	this.roundName = document.getElementById('roundName');
	this.mainRoundName = document.getElementById('gameAreaHeader');
	this.dotes = document.getElementsByClassName('dote');
	this.item = document.querySelectorAll('.item')
	this.counterRound = 0;

	this.initialization = function() {
		let that = this;

		this.prevButton.addEventListener('click', function(event) {
			that.showPrevRound(event);
		});

		this.nextButton.addEventListener('click', function(event) {
			that.showNextRound(event);
		});
	}

	this.showPrevRound = function() {
		this.counterRound--;

		//Возвращает фоны вопросам при переходе на предыдущий раунд
		this.item.forEach(item => {
			item.classList.remove('disabledQuestion')
		})

		for(let i = 0; i < this.dotes.length; i++) {
			this.dotes[i].classList.remove('active');
		}

		this.dotes[this.counterRound].classList.add('active');
		this.roundName.innerHTML = `Раунд ${this.counterRound + 1}`;
		this.mainRoundName.innerHTML = `Раунд ${this.counterRound + 1}`;
		this.nextButton.disabled = false;
		topic.showTopic(this.counterRound);

		if(this.counterRound == 0) {
			this.prevButton.disabled = true;
		}
	}

	this.showNextRound = function() {
		this.counterRound++;

		//Возвращает фоны вопросам при переходе на следующий раунд
		this.item.forEach(item => {
			item.classList.remove('disabledQuestion')
		})

		for(let i = 0; i < this.dotes.length; i++) {
			this.dotes[i].classList.remove('active');
		}

		this.dotes[this.counterRound].classList.add('active');
		this.roundName.innerHTML = `Раунд ${this.counterRound + 1}`;
		this.mainRoundName.innerHTML = `Раунд ${this.counterRound + 1}`;
		this.prevButton.disabled = false;
		topic.showTopic(this.counterRound);

		if(this.counterRound == 2) {
			this.nextButton.disabled = true;
		}
	}
}

//Констуктор объектов подсчёта очков игроков
function Player(player) {
	this.buttonDown = player.querySelector('.button-down');
	this.buttonUp = player.querySelector('.button-up');
	this.points = player.querySelector('#player');
	let currentPoint = 0;

	this.initialization = function() {
		let that = this;

		this.buttonDown.addEventListener('click', function(event) {
			let currentButtonNumber = question.buttonNumber;
			currentPoint -= +getCurentPoint(currentButtonNumber);
			that.points.innerHTML = currentPoint;
		});

		this.buttonUp.addEventListener('click', function(event) {
			let currentButtonNumber = question.buttonNumber;
			currentPoint += +getCurentPoint(currentButtonNumber);
			that.points.innerHTML = currentPoint;
		});
	}

	function getCurentPoint(buttonNumber) {
		if(buttonNumber < 5) {
			return (buttonNumber+1)*100;
		} else if(buttonNumber < 10) {
			return (buttonNumber-4)*100;
		} else if(buttonNumber < 15) {
			return (buttonNumber-9)*100;
		} else if(buttonNumber < 20) {
			return (buttonNumber-14)*100;
		} else if(buttonNumber < 25) {
			return (buttonNumber-19)*100;
		} else return (buttonNumber-24)*100;
	}
}

//Констуктор объектов добавления нового контента игры
function NewContent() {
	this.createButton = document.getElementById('createButton');
	this.addButton = document.getElementById('addButton');
	this.addContainer = document.querySelector('.add-continer');
	this.addArea = document.getElementById('addArea');

	this.initialization = function() {
		let that = this;

		this.createButton.addEventListener('click', function(event) {
			that.addContainer.classList.toggle('hide');
		});

		//Преобразует JSON файл в game.content
		this.addButton.addEventListener('click', function(event) {
			that.addContainer.classList.toggle('hide');

			let JSONtext = that.addArea.value;

			//Проверка JSON файла на пустое значание и на массив
			if(JSONtext == '' || JSONtext.slice(0, 1) != '[') {
				return;
			}

			let JSONobject  = JSON.parse(JSONtext);

			data = JSONobject;
			topic.showTopic();
		});
	}
}