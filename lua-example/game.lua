game = {}

local money = 100
local tower = 0
local score = 0
local timer = 2
local wavelevel = 0
local wave = {}

game.load = function()
end

game.update = function(delta_time)
	timer = timer - delta_time
	
	-- adds 1 enemy if the timer is over
	if timer < 0 then
		timer = timer + 3
		wavelevel = wavelevel + 1
		table.insert(wave, {
			x = math.random(10, 270),
			y = 30,
			worth = wavelevel * 10,
			hp = wavelevel * 20,
			speed = (wavelevel + 1) * 0.5,
			r = math.random(0, 230), g = math.random(0, 230), b = math.random(0, 230)
		})
	end
	
	-- moves every enemy
	if wave ~= nil then
		for index, enemy in ipairs(wave) do
			enemy.y = enemy.y + enemy.speed
		end
	end
	
	-- let the tower shoot at enemies
	if wave ~= nil then
		-- get farest enemy
		indexOfEnemy = -1
		valueOfEnemy = 0
		for index, enemy in ipairs(wave) do
			if valueOfEnemy < (enemy.hp + enemy.y) then
				valueOfEnemy = enemy.hp + enemy.y
				indexOfEnemy = index
			end
		end
		-- shoot only at farest enemy
		if indexOfEnemy > -1 then
			wave[indexOfEnemy].hp = wave[indexOfEnemy].hp - tower
			if wave[indexOfEnemy].hp <= 0 then
				wave[indexOfEnemy] = money + wave[indexOfEnemy].worth
				score = score + 1
				table.remove(wave, indexOfEnemy)
			end
		end
	end
	
	-- if 1 enemy reaches bottom -> gameover
	if wave ~= nil then
		for index, enemy in ipairs(wave) do
			if (enemy.y + enemy.hp) >= 600 then
				current_state = gameover
			end
		end
	end
end

game.keypressed = function(key)
	if key == "b" then
		if tower == 0 then
			if money >= 20 then
				money = money - 20
				tower = 1
			end
		end
	elseif key == "u" then
		if tower > 0 then
			if money >= 30 then
				tower = tower + 1
				money = money - 30
			end
		end
	end
end

game.draw = function()
  love.graphics.setFont(normalFont)
	love.graphics.setColor(0, 0, 0)
	
	-- wave information
  love.graphics.print('Next wave:', 10, 10)
  love.graphics.print(math.floor(timer), 80, 10)
  love.graphics.print('wave level:', 300, 10)
  love.graphics.print(wavelevel, 370, 10)
	
	-- draw whole wave
	if wave ~= nil then
		for index, enemy in ipairs(wave) do
			love.graphics.setColor(enemy.r, enemy.g, enemy.b)
			love.graphics.rectangle('fill', enemy.x, enemy.y, enemy.hp, enemy.hp)
		end
	end
	
	-- Tower
	love.graphics.setColor(230, 100, 0)
	love.graphics.rectangle('fill', 400, 300, tower * 10, tower * 10)
	
	-- Menü
	love.graphics.setColor(230, 230, 190)
	love.graphics.rectangle('fill', 600, 0, 200, 600)
	love.graphics.setColor(0, 0, 0)
  love.graphics.print('Menu', 610, 10)
  love.graphics.print('Money:', 610, 50)
  love.graphics.print(money, 660, 50)
  love.graphics.print('(B)uild Tower (20)', 610, 90)
  love.graphics.print('(U)pgrade Tower (30)', 610, 120)
  love.graphics.print('Tower Level:', 610, 150)
  love.graphics.print(tower, 690, 150)
  love.graphics.print('Score:', 610, 190)
  love.graphics.print(score, 660, 190)
end

-- call this method everytime the game restarts
game.restart = function()
	money = 100
	tower = 0
	score = 0
	timer = 2
	wavelevel = 0
	wave = {}
end

game.getScore = function()
	return score
end

function math.round(n)
    return math.floor(n+0.5)
end

return game