<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="snake">
<meta name="author" content="Benjamin Vreeland">

<title>Face Snake</title>

<link href="./resources/snake.css" rel="stylesheet">

</head>
<body>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<script src="https://apis.google.com/js/client.js"></script>
	<script src="./resources/snake.js"></script>
	<script src="./resources/config.js"></script>

<?php

$scale = @$_GET["scale"];
$speed = @$_GET["speed"];
$snake_url = @$_GET["snake_url"];
$food_url = @$_GET["food_url"];

function default_val(&$var, $default) {
	if (empty($var)) {
		$var = $default;
	}
}

default_val($scale, 20);
default_val($speed, 100);
default_val($snake_url, "https://i.imgur.com/CnZ7qW3.png");
default_val($food_url, "https://i.imgur.com/grps5vJ.png");
?>
	<script>
		var ops = {};
		ops.scale = "<?= $scale ?>";
		ops.speed = "<?= $speed ?>";
		ops.snake_url = "<?= $snake_url ?>";
		ops.food_url = "<?= $food_url ?>";
<?php
		if (count($_GET)) {
?>
			$(document).ready(function() {
				runGame(ops);
			});
<?php
		}
?>
	</script>
	<div id="options-overlay">
		<h1>
			<div id="overlay-message">New Game</div><br>
			<span id="overlay-score"></span>
		</h1>
		<form id="url">
			<input type="text" id="short-url"><br>
			<button type="button" onclick="getShortURL(window.location.href 
);">Get Short URL</button>
		</form>
		<br>
		<form id= "new-game">
			<label>Scale: <input type="text" id="scale" name="scale" value="<?= $scale ?>"></label>
			<label>Speed: <input type="text" id="speed" name="speed" value="<?= $speed ?>"></label>
			<label>Snake Picture: <input type="text" id="snake_url" name="snake_url" value="<?= $snake_url ?>"></label>
			<label>Food Picture: <input type="text" id="food_url" name="food_url" value="<?= $food_url ?>"></label>
			<label><input type="button" value="Begin New Game" onclick="softSubmit(ops);"></label>
		</form>
		
	</div>
	<canvas id="game-canvas" width="600" height="600"></canvas>
	
	<h2>Score: <span id="score">0<span></h2>
	
</body>
</html>
