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

function runGame(scale, speed, snake_url, food_url) {
	var game = {
		context: document.getElementById("game-canvas").getContext("2d"),
		px: $("#game-canvas").width()/scale, // game pixel size
		width: 1, // scaled width
		height: 1, //scaled height
		score: 0,
		tick: 0,
		snake: {
			pic: snake_url,//"https://i.imgur.com/CnZ7qW3.png",
			direction: "e",
			turn: "e",
			loc: [[3,1],[3,2],[3,3],[3,4]],
		},
		food: {
			pic: food_url,//"https://i.imgur.com/grps5vJ.png",
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
		game.snake.direction = game.snake.turn;
		switch (game.snake.direction) {
			case "n":	next_loc[1]--;	break;
			case "s":	next_loc[1]++;	break;
			case "e":	next_loc[0]++;	break;
			case "w":	next_loc[0]--;	break;
			default: break;
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
		
		game.snake.loc.unshift(next_loc);
		if ((next_loc[0] === game.food.loc[0])&&(next_loc[1] === game.food.loc[1])) {
			game.context.clearRect(next_loc[0]*game.px, next_loc[1]*game.px, game.px, game.px);
			game.context.drawImage(snake_pic, next_loc[0]*game.px, next_loc[1]*game.px, game.px, game.px);
			
			placeFood(game, food_pic);
			
			$("#score").text(++game.score);
		} else {
			game.context.drawImage(snake_pic, next_loc[0]*game.px, next_loc[1]*game.px, game.px, game.px);
			
			var tail = game.snake.loc.pop();
			game.context.clearRect(tail[0]*game.px, tail[1]*game.px, game.px, game.px);
		}
		
		return flag;
	}
	
	food_pic.onload = function() {
		placeFood();
	}
	food_pic.onerror = function() {
		console.log("Error with food image, using default.");
		game.food.pic = food_pic.src = "https://i.imgur.com/grps5vJ.png";
	}
	snake_pic.onload = function() {
		for (var node of game.snake.loc) {
			game.context.drawImage(snake_pic, node[0]*game.px, node[1]*game.px, game.px, game.px);
		}
	}
	snake_pic.onerror = function() {
		console.log("Error with snake image, using default.");
		game.snake.pic = snake_pic.src = "https://i.imgur.com/CnZ7qW3.png";
	}
	
	$(document).keydown( function(e) {
		switch (e.which) {
			case 38: // up
			if (game.snake.direction != "s") {game.snake.turn = "n";}
			break;
			case 37: // left
			if (game.snake.direction != "e") {game.snake.turn = "w";}
			break;
			case 40: // down
			if (game.snake.direction != "n") {game.snake.turn = "s";}
			break;
			case 39: // right
			if (game.snake.direction != "w") {game.snake.turn = "e";}
			break;

			case 87: // w
			if (game.snake.direction != "s") {game.snake.turn = "n";}
			break;
			case 65: // a
			if (game.snake.direction != "e") {game.snake.turn = "w";}
			break;
			case 83: // s
			if (game.snake.direction != "n") {game.snake.turn = "s";}
			break;
			case 68: // d
			if (game.snake.direction != "w") {game.snake.turn = "e";}
			break;

			default: return;
		}
		e.preventDefault();
	});
	
	var game_timer = setInterval( function() {
		if (tick() < 0) {
			clearInterval(game_timer);
		}
	}, speed);
	
}


$(document).ready(function() {
	
	runGame(20, 100, "wre","wer");// "https://i.imgur.com/CnZ7qW3.png", "https://i.imgur.com/grps5vJ.png");
});
