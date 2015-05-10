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

function runGame(ops) {
	$("#options-overlay").hide();
	
	var game = {
		context: document.getElementById("game-canvas").getContext("2d"),
		px: $("#game-canvas").width()/ops.scale, // game pixel size
		width: 1, // scaled width
		height: 1, //scaled height
		score: 0,
		tick: 0,
		snake: {
			pic: decodeURI(ops.snake_url),
			direction: "e",
			turn: "e",
			loc: [[3,1],[3,2],[3,3],[3,4]],
		},
		food: {
			pic: decodeURI(ops.food_url),
			loc: [],
		},
	};
	game.width = $("#game-canvas").width()/game.px;
	game.height = $("#game-canvas").height()/game.px;
	
	var snake_pic = new Image();
	snake_pic.src = game.snake.pic;
	var food_pic = new Image();
	food_pic.src = game.food.pic;
	
	game.context.clearRect(0 , 0, $("#game-canvas").width(), $("#game-canvas").height());
	
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
		//console.log(game.snake.direction+" moving towards "+next_loc);
		
		if ((next_loc[0] < 0)||(next_loc[1] < 0)||(next_loc[0] === game.width)||(next_loc[1] === game.height)) { // does it hit a wall?
			console.log("LOSS: snake hit wall\nSCORE: "+ game.score);
			return -1;
		} else {
			for (nongrata of game.snake.loc) {		// does it hit itself?
				if ((next_loc[0] === nongrata[0])&&(next_loc[1] === nongrata[1])) {
					console.log("LOSS: snake hit itself\nSCORE: "+ game.score);
					return -2;
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
		var status = tick();
		if (status < 0) {
			clearInterval(game_timer);
			
			$("#overlay-message").text("Game Over");
			if (status === -1) {
				$("#overlay-message").append("<br>You ran into a wall.<br>");
			} else if (status === -2) {
				$("#overlay-message").append("<br>You ran into yourself.<br>");
			}
			$("#overlay-score").text("Score: "+game.score);
			$("#options-overlay").show();
		}
	}, ops.speed);
	
}

function getShortURL(long_url) {
	gapi.client.setApiKey(api.key);
	gapi.client.load('urlshortener', 'v1', function() {
		var request = gapi.client.urlshortener.url.insert({
			'resource': {
				'longUrl': long_url
			}
		});
		var response = request.execute( function(response) {
			if (response.error) {
				console.log('Error. ' + response.error.message);
			} else {
				$('#short-url').val(response.id);
				$('#short-url').select().focus();
			}
		});
	});
}

function softSubmit(ops) {
	if ( (ops.scale === $("#scale").val()) && (ops.speed === $("#speed").val()) && (ops.snake_url === $("#snake_url").val()) && (ops.food_url === $("#food_url").val()) ) {
		console.log("No options changed, starting game with current options.");
		runGame(ops);
	} else {
		$("#new-game").submit();
	}
}

$(document).ready(function() {
	if (typeof api === 'undefined') {
		$('#url').hide();
	}
	
	$("input[type='text']").on("click", function () {
		$(this).select();
	});
});
