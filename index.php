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
	<script src="./resources/snake.js"></script>

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

if (count($_GET)) {
?>
	<script>
		$(document).ready(function() {
			runGame("<?= $scale ?>", "<?= $speed ?>", "<?= $snake_url ?>", "<?= $food_url ?>");
		});
	</script>
<?php
}
?>
	<div id="options-overlay">
		<h1>
			<span id="message">New Game</span>
		</h1>
		<form action="index.php">
			<input type="text" name="scale" value="<?= $scale ?>">
			<input type="text" name="speed" value="<?= $speed ?>">
			<input type="text" name="snake_url" value="<?= $snake_url ?>">
			<input type="text" name="food_url" value="<?= $food_url ?>">
			
			<input type="submit" value="Begin">
		</form>
	</div>
	<canvas id="game-canvas" width="600" height="600"></canvas>
	
	<h2>Score: <span id="score">0<span></h2>
	
</body>
</html>
