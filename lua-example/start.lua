start = {}


start.load = function()
end

start.update = function(delta_time)
end

start.keypressed = function(key)
	if key == "e" then
		os.exit();
	elseif key == "n" then
		current_state = game
	end
end

start.draw = function()
	love.graphics.setColor(0, 0, 0)
  love.graphics.setFont(largeFont)
  love.graphics.print('(N)ew Game', 50, 50)
  love.graphics.print('Highscore', 50, 100)
  love.graphics.print('(E)xit', 50, 150)
end

return start