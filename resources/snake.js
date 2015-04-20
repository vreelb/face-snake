function getRandomLocation(pixel_size, blacklist) {	
	var x = Math.floor(Math.random() * ($("#game-canvas").width()/pixel_size) );
	var y = Math.floor(Math.random() * ($("#game-canvas").height()/pixel_size) );
	
	var x_y = [x, y];
	//console.log(x_y);
	
	for (nongrata of blacklist) {
		if ((x === nongrata[0])&&(y === nongrata[1])) {
			x_y = getRandomLocation(pixel_size, blacklist); // recursively get a free space
			break;
		}
	}
	
	return x_y;
}

function drawGame(game) {
	var px = game.pixel_size;
	//game.context.clearRect(0, 0, $("#game-canvas").width(), $("#game-canvas").height());
	
	var snake_pic = new Image();
	snake_pic.src = game.snake.pic;
	var food_pic = new Image();
	food_pic.src = game.food.pic;
	
	food_pic.onload = function() {
		game.context.drawImage(food_pic, game.food.loc[0]*px, game.food.loc[1]*px, px, px);
		//console.log("food drawn at "+game.food.loc[0]+", "+game.food.loc[1]);
	}
	
	snake_pic.onload = function() {
		for (var node of game.snake.loc) {
			game.context.drawImage(snake_pic, node[0]*px, node[1]*px, px, px);
			//console.log("snake piece drawn at "+node);
		}
	}
	
}

function tick(game) {
	var flag = 0;
	var next_loc = [game.snake.loc[0][0], game.snake.loc[0][1]];
	
	if (game.snake.direction == "n") {
		next_loc[1]--;
	} else if (game.snake.direction == "s") {
		next_loc[1]++;
	} else if (game.snake.direction == "e") {
		next_loc[0]++;
	} else if (game.snake.direction == "w") {
		next_loc[0]--;
	}
	console.log(game.snake.direction+" moving towards "+next_loc);
	
	if ((next_loc[0] < 0)||(next_loc[1] < 0)) { // does it hit a wall?
		console.log("LOSS: snake hit wall\nSCORE: "+ game.score);
		return -1;
	} else {
		for (nongrata of game.snake.loc) {		// does it hit itself?
			if ((next_loc[0] === nongrata[0])&&(next_loc[1] === nongrata[1])) {
				console.log("LOSS: snake hit itself\nSCORE: "+ game.score);
				return -1;
			}
		}
	}
	
	game.snake.loc.unshift(next_loc);
	
	if ((next_loc[0] === game.food.loc[0])&&(next_loc[1] === game.food.loc[1])) {
		game.score++;
		
		game.context.clearRect(next_loc[0]*game.pixel_size, next_loc[1]*game.pixel_size, game.pixel_size, game.pixel_size);
		
		game.food.loc = getRandomLocation(game.pixel_size, game.snake.loc);
	} else {
		var tail = game.snake.loc.pop();
		game.context.clearRect(tail[0]*game.pixel_size, tail[1]*game.pixel_size, game.pixel_size, game.pixel_size);
	}
	
	//console.log(game.tick++, game.snake.loc, game.score);
	return flag;
}

function runGame(scale) {
	var game_canvas = document.getElementById("game-canvas");
	
	var game = {
		context: game_canvas.getContext("2d"),
		pixel_size: $("#game-canvas").width()/scale,
		score: 0,
		tick: 0,
		snake: {
			pic: "https://i.imgur.com/CnZ7qW3.png",//"test.png",
			direction: "w",
			loc: [[5,5],[6,5],[7,5],[7,6]],
		},
		food: {
			pic: "https://i.imgur.com/grps5vJ.png",//"test2.png",
			loc: [],
		},
	};
	
	game.food.loc = getRandomLocation(game.pixel_size, game.snake.loc);
	
	$(document).keydown(function(e) {
	switch(e.which) {
		case 38: // up
		game.snake.direction = "n";
		break;
		case 37: // left
		game.snake.direction = "w";
		break;
		case 40: // down
		game.snake.direction = "s";
		break;
		case 39: // right
		game.snake.direction = "e";
		break;

		case 87: // w
		game.snake.direction = "n";
		break;
		case 65: // a
		game.snake.direction = "w";
		break;
		case 83: // s
		game.snake.direction = "s";
		break;
		case 68: // d
		game.snake.direction = "e";
		break;

		default: return;
	}
	e.preventDefault();
	});
	
	var game_timer = setInterval( function() {
		if (tick(game) < 0) {
			clearInterval(game_timer);
		}
		drawGame(game);
	}, 500);
	
}


$(document).ready(function() {
	runGame(10);
});