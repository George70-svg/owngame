'use strict'

//Инициализация создания объекта game, который содержит добавленную
//Пользователем информацию
let game = new GameContentConstructor();
game.getGameContent();

//Инициализация создания объекта текста game.content в textarea,  
//который содержит всю информацию о игре, добавленную пользователем
let gameText = new GameInfo();
gameText.getInfo();
gameText.addInfo();

//Конструктор объекта создания одной темы игры
function TopicInfo(topic, questions, settings) {
	this.topicName = topic;
	this.questions = {
		100: questions[0],
		200: questions[1],
		300: questions[2],
		400: questions[3],
		500: questions[4],
	};
	this.settings = {
		1: settings[0],
		2: settings[1],
		3: settings[2],
		4: settings[3],
		5: settings[4],
	};
}

//Конструктор общего контента игры
function GameContentConstructor() {
	//Создание массива из всех кнопок 'Добавить' == 'send-button'
	this.sendButtons = document.getElementsByClassName('send-button');

	//Инициализация создания контента после нажатия пользователем кнопки 'Добавить' == 'send-button'
	this.getGameContent = function() {
		let that = this;

		for(let i = 0; i < this.sendButtons.length; i++) {
			//Добавляется addEventListener к каждой кнопке 'Добавить'
			this.sendButtons[i].addEventListener('click', function(event) {
				that.creatGameContent(event);
			});
		}
	}

	//Пустой массив, куда добавляется весь созданый контент
	this.contentGetEmpty = [];
	//Пустой массив, куда добавляется весь созданый контент без пустых элементов
	this.content = [];

	//Получение введённых пользователем названия темы, вопросов, настройки вида вопросов
	this.creatGameContent = function(event) {
		//Получение номера нажатой пользователем кнопки 'Добавить' от 0 до 17
		//из обрезанного названия класса, полученного через DOM
		let buttonNumber;

		if(event.path) {
			buttonNumber = +event.path[2].className.slice(12) - 1;	//Для chromium, edge
		} else if(event.composedPath()) {
			buttonNumber = +event.composedPath()[2].className.slice(12) - 1;	//ХЗ
		} else {
			buttonNumber = +event.composedPath[2].className.slice(12) - 1;	//Для firefox
		}

		//Вызов методов получения названия темы, вопросов, настроек вида вопросов
		let currentGameContent = new TopicInfo(
			this.getCurrentTopic(buttonNumber), 
			this.getCurrentQuestions(buttonNumber),
			this.getCurrentSetting(buttonNumber),
		);

		//Если название темы не заполнено, то не она не добавляется
		if(this.getCurrentTopic(buttonNumber) === '') {
			return;
		}

		//Создаётся массив, где темам выделяются места согласно их номерам
		this.contentGetEmpty[buttonNumber] = currentGameContent;
		//Создаётся массив, где удаляются пустые темы
		this.content = this.contentGetEmpty.filter(item => item !== null);
	}

	//Метод получения текущей темы
	this.getCurrentTopic = function(buttonNumber) {
		return document.getElementsByClassName('topicName')[buttonNumber].value;
	}

	//Метод получения текущих вопросов
	this.getCurrentQuestions = function(buttonNumber) {
		let curentQuestionsArray = [];
		
		for(let i = buttonNumber * 5; i < (buttonNumber * 5 + 5); i++) {
			let curentQuestions = document.getElementsByClassName('question-text')[i].value;
			curentQuestionsArray.push(curentQuestions);
		}

		return curentQuestionsArray;
	}

	//Метод получения текущих настроек вида вопросов (Текст или картинка)
	this.getCurrentSetting = function(buttonNumber) {
		let allInput = document.getElementsByTagName('input');
		let currentSettingArray = [];
		let allSetting = [];

		for(let item of allInput) {
			if(item.getAttribute('type') == 'radio') {
				if(item.checked == true) {
					allSetting.push(item.className);
				}
			}
		}

		for(let i = buttonNumber * 5; i < (buttonNumber * 5 + 5); i++) {
			currentSettingArray.push(allSetting[i]);
		}

		return currentSettingArray;
	}
}

//Конструктор объекта формирования итого файла с контентом игры
function GameInfo() {
	this.addButton = document.getElementById('add-button');
	this.getButton = document.getElementById('get-button');
	this.addTextArea = document.getElementById('add-text');
	this.getTextArea = document.getElementById('getText');
	this.content = null;

	this.getInfo = function() {
		let that = this;

		//Преобразует game.content в JSON файл и выдаёт текст в textarea
		this.getButton.addEventListener('click', function() {
			let JSONtext = JSON.stringify(game.content);
			that.getTextArea.innerHTML = JSONtext;
		});
	}
}