import { createGrid } from './CreateGridsDiv.js'
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
  btnGameType,
  gridTitle,
  gameTimer,
  pauseScreen,
  btnPause,
  btnResume,
  btnNewGame,
  mainSudokuGrid,
  numberKeys,
} from './BtnAssign.js'
import { CONSTANT } from './Constants.js'
import { sudokuGen } from './Sudoku.js'

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
let cells = undefined
let numberInputs = undefined

let level_index = 0
let level = CONSTANT.LEVEL[level_index]

let grid_index = 3
let gridSize = CONSTANT.GRID[grid_index]

let gameTypeIndex = 0
let gameType = CONSTANT.GAME_TYPE[gameTypeIndex]

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
  grid_index = grid_index + 1 > CONSTANT.GRID.length - 1 ? 0 : grid_index + 1
  gridSize = CONSTANT.GRID[grid_index]
  e.target.innerHTML = CONSTANT.GRID_TYPE[grid_index] + ' GRID'
})

btnGameType.addEventListener('click', (e) => {
  gameTypeIndex = gameTypeIndex + 1 > CONSTANT.GAME_TYPE.length - 1 ? 0 : gameTypeIndex + 1
  gameType = CONSTANT.GAME_TYPE[gameTypeIndex]
  e.target.innerHTML = CONSTANT.GAME_NAME[gameTypeIndex]
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

btnPause.addEventListener('click', () => {
  pauseScreen.classList.add('active')
  // gameScreen.classList.remove('active')
  pause = true
})

btnResume.addEventListener('click', () => {
  pauseScreen.classList.remove('active')
  // gameScreen.classList.remove('active')
  pause = false
})

btnNewGame.addEventListener('click', () => {
  returnStartScreen()
})
// end eventsListeners

// arrow functions
const getGameInfo = () => JSON.parse(localStorage.getItem('game'))
const setPlayerName = (name) => localStorage.setItem('playerName', name)
const getPlayerName = () => localStorage.getItem('playerName')
const showTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19)
// end arrow functions

// functions
function init() {
  const darkmode = JSON.parse(localStorage.getItem('darkmode'))
  btnBody.classList.add(darkmode ? 'light' : 'dark')
  btnBody.classList.remove(darkmode ? 'dark' : 'light')
  themeMode = darkmode ? 'dark' : 'light'
  metaNameThemeColor.setAttribute('content', darkmode ? '#1a1a2e' : '#fff')

  const game = getGameInfo()

  // this is what makes the continue button on the start-screen show
  btnContinue.style.display = game ? 'grid' : 'none'

  if (getPlayerName()) {
    nameInput.value = getPlayerName()
  } else {
    nameInput.focus()
  }
}

function initSudoku() {
  clearSudoku()
  clearKeyboard()
  createGrid(gridSize, gameType)

  cells = document.querySelectorAll('.main-grid-cell')
  numberInputs = document.querySelectorAll('.number')
  // resetBg()
  // Generate sudoku puzzle
  // console.log('-------------initSudoku--------------')
  // console.log(level)
  // console.log(gridSize)
  // console.log(gameType)
  // console.log('-------------end initSudoku--------------')
  su = sudokuGen(level, gridSize, gameType)
  console.log('su.keyColors', su.keyColors)
  suAnswer = JSON.parse(JSON.stringify(su.question))
  console.log('suAnswer', suAnswer)
  setSudokuToDiv()
}

function startGame() {
  startScreen.classList.remove('active')
  gameScreen.classList.add('active')
  playerName.innerHTML = nameInput.value.toUpperCase().trim()
  setPlayerName(nameInput.value.trim())
  gameLevel.innerHTML = CONSTANT.LEVEL_NAME[level_index]
  // createGrid(gridSize, gameType)
  // cells = document.querySelectorAll('.main-grid-cell')
  // numberInputs = document.querySelectorAll('.number')
  gridTitle.innerHTML = `GRID ${CONSTANT.GRID_TYPE[grid_index]} ${CONSTANT.GAME_NAME[gameTypeIndex]} `
  seconds = 0
  showTime(seconds)
  timer = setInterval(() => {
    if (!pause) {
      seconds = seconds + 1
      gameTimer.innerHTML = showTime(seconds)
    }
  }, 1000)
}

function setSudokuToDiv() {
  for (let i = 0; i < Math.pow(gridSize, 2); i++) {
    const colorGame = gameType === 6 ? true : false
    let row = Math.floor(i / gridSize)
    let col = i % gridSize
    const divValue = su.question[row][col]

    cells[i].setAttribute('data-value', divValue)
    cells[i].classList.add(colorGame ? `color-${divValue}` : 'color-main')

    if (divValue !== '-') {
      cells[i].classList.add('filled')
      cells[i].innerHTML += colorGame ? 'O' : divValue
    }
  }
}

function returnStartScreen() {
  clearInterval(timer)
  clearSudoku()
  clearKeyboard()
  pause = false
  seconds = 0
  startScreen.classList.add('active')
  gameScreen.classList.remove('active')
  pauseScreen.classList.remove('active')
  errorCount = 0
  gameTimer.innerHTML = '00:00:00'
}

function clearSudoku() {
  if (document.querySelector('.main-grid-cell')) {
    for (let i = 0; i < Math.pow(gridSize, 2); i++) {
      cells[i].innerHTML = ''
      cells[i].classList.remove('filled')
      cells[i].classList.remove('fill-ans')
      cells[i].classList.remove('selected')
      cells[i].classList.remove('hover')
    }
  }

  let childDivs = document.querySelectorAll('#main-sudoku-grid > div')
  for (var i = 0; i < childDivs.length; i++) {
    childDivs[i].remove()
  }
  mainSudokuGrid.classList.remove(`grid-${gridSize}`)
}

function clearKeyboard() {
  if (document.querySelector('.number')) {
    for (let i = 0; i < gridSize; i++) {
      numberInputs[i].innerHTML = ''
    }
    let childDivs = document.querySelectorAll('#numbers-keys > div')
    for (var i = 0; i < childDivs.length; i++) {
      childDivs[i].remove()
    }
    numberKeys.classList.remove(`grid-${gridSize}`)
  }
}

function resetBg() {
  cells.forEach((e) => e.classList.remove('hover'))
}

// end functions

init()
