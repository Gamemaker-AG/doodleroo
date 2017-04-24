gameover = {}


gameover.load = function()
end

gameover.update = function(delta_time)
end

gameover.keypressed = function(key)
	if key == "e" then
		os.exit();
	elseif key == "n" then
		game.restart()
		current_state = game
	end
end

gameover.draw = function()
	love.graphics.setColor(0, 0, 0)
  love.graphics.setFont(largeFont)
  love.graphics.print('(N)ew Game', 50, 50)
  love.graphics.print('Highscore', 50, 100)
  love.graphics.print('(E)xit', 50, 150)
  love.graphics.print('Your score:', 100, 400)
  love.graphics.print(game.getScore(), 330, 400)
end

return gameover