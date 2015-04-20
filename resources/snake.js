function getRandomLocation(pixel_size, blacklist) {
	var x_y = [
		Math.floor(Math.random() * ($("#game-canvas").width()/pixel_size) ),
		Math.floor(Math.random() * ($("#game-canvas").height()/pixel_size) ),
	];
	
	for (nongrata of blacklist) {
		if ((x_y[0] === nongrata[0])&&(x_y[1] === nongrata[1])) {
			x_y = getRandomLocation(pixel_size, blacklist); // recursively get a free space
			break;
		}
	}
	
	return x_y;
}

function runGame(scale) {
	var game = {
		context: document.getElementById("game-canvas").getContext("2d"),
		px: $("#game-canvas").width()/scale, // game pixel size
		width: 1, // scaled width
		height: 1, //scaled height
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
	game.width = $("#game-canvas").width()/game.px;
	game.height = $("#game-canvas").height()/game.px;
	
	var snake_pic = new Image();
	snake_pic.src = game.snake.pic;
	var food_pic = new Image();
	food_pic.src = game.food.pic;
	
	function placeFood() {
		game.food.loc = getRandomLocation(game.px, game.snake.loc);
		
		game.context.drawImage(food_pic, game.food.loc[0]*game.px, game.food.loc[1]*game.px, game.px, game.px);
	}
	
	function tick() {
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
		
		if ((next_loc[0] < 0)||(next_loc[1] < 0)||(next_loc[0] === game.width)||(next_loc[1] === game.height)) { // does it hit a wall?
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
		
		if ((next_loc[0] === game.food.loc[0])&&(next_loc[1] === game.food.loc[1])) {
			game.score++;
			game.context.clearRect(next_loc[0]*game.px, next_loc[1]*game.px, game.px, game.px);
			placeFood(game, food_pic);
		} else {
			var tail = game.snake.loc.pop();
			game.context.clearRect(tail[0]*game.px, tail[1]*game.px, game.px, game.px);
		}
		game.snake.loc.unshift(next_loc);
		game.context.drawImage(snake_pic, next_loc[0]*game.px, next_loc[1]*game.px, game.px, game.px);
		
		//console.log(game.tick++, game.snake.loc, game.score);
		return flag;
	}
	
	food_pic.onload = function() {
		placeFood();
	}
	snake_pic.onload = function() {
		for (var node of game.snake.loc) {
			game.context.drawImage(snake_pic, node[0]*game.px, node[1]*game.px, game.px, game.px);
		}
	}
	
	$(document).keydown( function(e) {
		switch(e.which) {
			case 38: // up
			if (game.snake.direction != "s") {game.snake.direction = "n";}
			break;
			case 37: // left
			if (game.snake.direction != "e") {game.snake.direction = "w";}
			break;
			case 40: // down
			if (game.snake.direction != "n") {game.snake.direction = "s";}
			break;
			case 39: // right
			if (game.snake.direction != "w") {game.snake.direction = "e";}
			break;

			case 87: // w
			if (game.snake.direction != "s") {game.snake.direction = "n";}
			break;
			case 65: // a
			if (game.snake.direction != "e") {game.snake.direction = "w";}
			break;
			case 83: // s
			if (game.snake.direction != "n") {game.snake.direction = "s";}
			break;
			case 68: // d
			if (game.snake.direction != "w") {game.snake.direction = "e";}
			break;

			default: return;
		}
		e.preventDefault();
	});
	
	var game_timer = setInterval( function() {
		if (tick() < 0) {
			clearInterval(game_timer);
		}
	}, 500);
	
}


$(document).ready(function() {
	runGame(10);
});