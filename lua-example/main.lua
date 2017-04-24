start = require('./start')
game = require('./game')
gameover = require('./gameover')
current_state = start

-- 800x600
function love.load()
  love.window.setTitle('TowerDefence')
  love.graphics.setBackgroundColor(255, 255, 255)
  normalFont = love.graphics.newFont(12)
  semiLargeFont = love.graphics.newFont(22)
  largeFont = love.graphics.newFont(40)
  love.graphics.setFont(normalFont)

  highscore_name = ''
end

function love.update(delta_time)
  if current_state.update then
    current_state.update(delta_time)
  end
end

function love.draw()
  if current_state.draw then
    current_state.draw()
  end
end

function love.keypressed(key)
  if key == "escape" then
    os.exit()
  elseif current_state.keypressed then
    current_state.keypressed(key)
  end
end

function love.mousepressed(x, y, button, istouch)
  current_state.mousepressed(x, y, button, istouch)
end
