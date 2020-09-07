var FIELD_WIDTH = 20,
	FIELD_HEIGHT = 20,
	SNAKE_SPEED = 300;
	
var snake = [],
	direction = 'y+',
	gameRun = false,
	scores = 0,
	snakeSpeedChanged,
	snakeMove;


createField(FIELD_WIDTH, FIELD_HEIGHT);
var startButton = document.getElementById('button');
var foodCount = document.getElementById('food-count');
startButton.onclick = startGame;

addEventListener('keydown', changeDirection);

function createField(cells, rows) {
	var snakeField = document.getElementById('snake-field');
	var table = document.createElement('table');
	table.id = 'snakeTable';
	for (var i = 0; i < rows; i++) {
		var row = document.createElement('tr');
		row.id = 'row-' + i;
		row.className = 'row';
		
		for (var j = 0; j < cells; j++) {
			var cell = document.createElement('td');
			cell.id = 'cell-' + i + '-' + j;
			cell.className = 'cell';
			row.appendChild(cell);
		}
		table.appendChild(row);
		
	}
	snakeField.appendChild(table);
}
function changeDirection(e) {
    console.log(e);
}
function startGame() {
	var allCells = document.getElementsByClassName('cell');
	for (var i in allCells) {
		allCells[i].className = 'cell';
	}
	snake = [];
	scores = 0;
	snakeSpeedChanged = SNAKE_SPEED;
	clearInterval(snakeMove);
	
	var snakeHead = document.getElementById('cell-' + Math.round(FIELD_HEIGHT/2) + '-' + Math.round(FIELD_WIDTH/2));
	var snakeTail = document.getElementById('cell-' + Math.round(FIELD_HEIGHT/2-1) + '-' + Math.round(FIELD_WIDTH/2));
	snakeHead.classList.add('snake-unit');
	snakeTail.classList.add('snake-unit');
	
	snake.push(snakeHead);
	snake.push(snakeTail);
	
	createFood();
	
	snakeMove = setInterval(move, SNAKE_SPEED);
}

function move() {
	var headX = parseInt(snake[snake.length - 1].id.split('-')[2]);
	var headY = parseInt(snake[snake.length - 1].id.split('-')[1]);
	var newUnit;
	switch(direction) {
		case 'y+': 
			newUnit = document.getElementById('cell-' + --headY + '-' + headX);
			break;
		case 'x+':
			newUnit = document.getElementById('cell-' + headY + '-' + ++headX);
			break;
		case 'x-':
			newUnit = document.getElementById('cell-' + headY + '-' + --headX);
			break;
		case 'y-':
			newUnit = document.getElementById('cell-' + ++headY + '-' + headX);
			break;
	}
	if (newUnit === null) {
		switch(direction) {
			case 'y+': 
				newUnit = document.getElementById('cell-' + (FIELD_HEIGHT - 1) + '-' + headX);
				break;
			case 'x+':
				newUnit = document.getElementById('cell-' + headY + '-0');
				break;
			case 'x-':
				newUnit = document.getElementById('cell-' + headY + '-' + (FIELD_WIDTH - 1));
				break;
			case 'y-':
				newUnit = document.getElementById('cell-0-' + headX);
				break;
		}
	}
	
	
	if (newUnit.classList.contains('snake-unit') || newUnit.classList.contains('obstacle')) {
		if(gameOver()) {
			startGame();
		} else {
			window.location.reload();
		}
	}
	
	newUnit.classList.add('snake-unit');
	snake.push(newUnit);
	
	if (!newUnit.classList.contains('food')) {
		snake[0].classList.remove('snake-unit');
		snake.splice(0, 1);
	} else if (newUnit.classList.contains('food')) {
		newUnit.classList.remove('food');
		foodCount.innerHTML = 'Очки: ' + ++scores;
		createFood();
		createObstacle();
		clearInterval(snakeMove);
		snakeSpeedChanged -= 5;
		snakeMove = setInterval(move, snakeSpeedChanged);
		console.log(snakeSpeedChanged);
	} 
}

function createFood() {
	var foodCreated = false;
	
	while (!foodCreated) {
		var foodCell = document.getElementById('cell-' + Math.floor(Math.random() * FIELD_HEIGHT) + '-' + Math.floor(Math.random() * FIELD_WIDTH));
	
		if (!foodCell.classList.contains('snake-unit') && 
			!foodCell.classList.contains('obstacle') && 
			!foodCell.classList.contains('food')) {
				
			foodCell.classList.add('food');
			foodCreated = true;
		}
	}
}

function createObstacle() {
	var obstacleCreated = false;
	
	while (!obstacleCreated) {
		var obstacleCell = document.getElementById('cell-' + Math.floor(Math.random() * FIELD_HEIGHT) + '-' + Math.floor(Math.random() * FIELD_WIDTH));
	
		if (!obstacleCell.classList.contains('snake-unit') && 
			!obstacleCell.classList.contains('obstacle') && 
			!obstacleCell.classList.contains('food')) {
				
			obstacleCell.classList.add('obstacle');
			obstacleCreated = true;
		}
	}
}

function changeDirection(e) {
	switch (e.keyCode) {
        case 37: // Клавиша влево
            if (direction != 'x+') {
                direction = 'x-'
            }
            break;
        case 38: // Клавиша вверх
            if (direction != 'y-') {
                direction = 'y+'
            }
            break;
        case 39: // Клавиша вправо
            if (direction != 'x-') {
                direction = 'x+'
            }
            break;
        case 40: // Клавиша вниз
            if (direction != 'y+') {
                direction = 'y-'
            }
            break;
    }
}

function restart() {
	var allCells = document.getElementsByClassName('cell');
	for (var i in allCells) {
		allCells[i].className = 'cell';
	}
}
function gameOver() {
	clearInterval(snakeMove);
	var newGame = confirm('Вы проиграли! Ваш результат: ' + scores + '\nЖелаете начать новую игру?');
	return newGame;
}