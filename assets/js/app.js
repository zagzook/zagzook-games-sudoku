import { create9Grid } from './CreateGridsDiv.js'
import {
  darkModeToggle,
  btnBody,
  metaNameThemeColor,
  btnContinue,
  btnPlay,
  nameInput,
  btnLevel,
  btnGridSize,
  startScreen,
  gameScreen,
  playerName,
  gameLevel,
} from './BtnAssign.js'
import { CONSTANT } from './Constants.js'

// Toggle dark mode
let themeMode = 'dark'
darkModeToggle.addEventListener('click', () => {
  const isDarkMode = btnBody.classList.contains('dark')
  btnBody.classList.add(isDarkMode ? 'light' : 'dark')
  btnBody.classList.remove(isDarkMode ? 'dark' : 'light')

  themeMode = isDarkMode ? 'dark' : 'light'
  localStorage.setItem('darkmode', isDarkMode)
  // change mobile status bar color
  metaNameThemeColor.setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff')
})
// End Toggle dark mode

// initial value
let gameType = ''
let level_index = 0
let grid_index = 3
let level = CONSTANT.LEVEL[level_index]
let gridSize = CONSTANT.GRID[grid_index]
let timer = null
let pause = false
let seconds = 0
let su = undefined
let suAnswer = undefined
let selectedCell = -1
let errorCount = 0
// end initial value

// eventsListeners
btnLevel.addEventListener('click', (e) => {
  level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1
  level = CONSTANT.LEVEL[level_index]
  e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index]
})

btnGridSize.addEventListener('click', (e) => {
  grid_index = grid_index + 1 > 4 - 1 ? 0 : grid_index + 1
  gridSize = CONSTANT.GRID[grid_index]
  e.target.innerHTML = CONSTANT.GRID_TYPE[grid_index] + ' GRID'
})

btnPlay.addEventListener('click', () => {
  if (nameInput.value.trim().length > 0) {
    initSudoku()
    startGame()
  } else {
    nameInput.classList.add('input-err')
    setTimeout(() => {
      nameInput.classList.remove('input-err')
      nameInput.focus()
    }, 500)
  }
})
// end eventsListeners

// arrow functions
const getGameInfo = () => JSON.parse(localStorage.getItem('game'))

const setPlayerName = (name) => localStorage.setItem('playerName', name)
// end arrow functions

// functions
function init() {
  const cells = document.querySelectorAll('.main-grid-cell')
  const numberInputs = document.querySelectorAll('.number')
  const darkmode = JSON.parse(localStorage.getItem('darkmode'))
  btnBody.classList.add(darkmode ? 'light' : 'dark')
  btnBody.classList.remove(darkmode ? 'dark' : 'light')
  themeMode = darkmode ? 'dark' : 'light'
  metaNameThemeColor.setAttribute('content', darkmode ? '#1a1a2e' : '#fff')

  const game = getGameInfo()

  // this is what makes the continue button on the start-screen show
  btnContinue.style.display = game ? 'grid' : 'none'
}

function initSudoku() {
  // const LevelName = CONSTANT.LEVEL_NAME[LevelName]
}

function startGame() {
  console.log(startScreen)
  console.log(gameScreen)
  console.log(gameLevel)
  console.log(playerName)
  startScreen.classList.remove('active')
  gameScreen.classList.add('active')
  playerName.innerHTML = nameInput.value.trim()
  setPlayerName(nameInput.value.trim())
  gameLevel.innerHTML = CONSTANT.LEVEL_NAME[level_index]
  console.log(gridSize)
  create9Grid(gridSize)
}

// end functions

init()
