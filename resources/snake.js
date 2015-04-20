function getRandomLocation(pixel_size, blacklist) {	
	var x = Math.floor(Math.random() * ($("#game-canvas").width()/pixel_size) );
	var y = Math.floor(Math.random() * ($("#game-canvas").width()/pixel_size) );
	
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
	
	var snake_pic = new Image();
	snake_pic.src = game.snake.pic;
	var food_pic = new Image();
	food_pic.src = game.food.pic;
	
	food_pic.onload = function() {
		game.context.drawImage(food_pic, game.food.loc[0]*px, game.food.loc[1]*px, px, px);
		console.log("food drawn at "+game.food.loc[0]+", "+game.food.loc[1]);
	}
	
	snake_pic.onload = function() {
		for (var hump of game.snake.loc) {
			game.context.drawImage(snake_pic, hump[0]*px, hump[1]*px, px, px);
			console.log("snake piece drawn at "+hump);
		}
	}
	
}

function runGame(scale) {
	var game_canvas = document.getElementById("game-canvas");
	
	var game = {
		context: game_canvas.getContext("2d"),
		pixel_size: $("#game-canvas").width()/scale,
		score: 0,
		snake: {
			pic: "test.png",
			length: 5,
			direction: Math.floor(Math.random()*4),		// clockwise N, E, S, W
			loc: [[5,5],[6,5],[7,5],[7,6]],
		},
		food: {
			pic: "test2.png",
			loc: [],
		},
	};
	
	game.food.loc = getRandomLocation(game.pixel_size, game.snake.loc);
	
	drawGame(game);
	
}


$(document).ready(function() {
	runGame(10);
});