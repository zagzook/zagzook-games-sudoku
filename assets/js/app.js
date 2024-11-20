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
  btnGameVersion,
} from './BtnAssign.js'
import { CONSTANT } from './Constants.js'
import { sudokuGen, getGameVersionDB, setSeeds } from './Sudoku.js'

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
let level_name = CONSTANT.LEVEL_NAME[level_index]

let grid_index = 3
let grid_size = CONSTANT.GRID_SIZE[grid_index]
let grid_size_name = CONSTANT.GRID_TYPE[grid_index]

let game_type_index = 0
let game_type = CONSTANT.GAME_TYPE[game_type_index]
let game_type_name = CONSTANT.GAME_NAME[game_type_index]

let game_version_index = 0
let game_version = CONSTANT.GAME_VERSION[game_version_index]
let game_version_name = CONSTANT.GAME_VERSION_NAME[game_version_index]

let gameVersionDB = CONSTANT.GAME_VERSION_9X9

let solutionSeed = 1
let boardSeed = 1001
let keyBoardSeed = 1
let gameSeed = 1

let timer = null
let pause = false
let seconds = 0
let su = undefined
let suAnswer = undefined
let selectedCell = -1
let errorCount = 0

// end initial value

// eventsListeners
btnGridSize.addEventListener('click', (e) => {
  grid_index = grid_index + 1 > CONSTANT.GRID_SIZE.length - 1 ? 0 : grid_index + 1
  grid_size = CONSTANT.GRID_SIZE[grid_index]
  grid_size_name = CONSTANT.GRID_TYPE[grid_index]
  btnGameVersion.innerHTML = CONSTANT.GAME_VERSION_NAME[0]
  e.target.innerHTML = grid_size_name + ' GRID'
})

btnGameVersion.addEventListener('click', (e) => {
  gameVersionDB = getGameVersionDB(grid_size)
  game_version_index = game_version_index + 1 > gameVersionDB.length - 1 ? 0 : game_version_index + 1
  game_version = gameVersionDB[game_version_index]
  game_version_name = CONSTANT.GAME_VERSION_NAME[game_version - 1]
  e.target.innerHTML = game_version_name
})

btnLevel.addEventListener('click', (e) => {
  level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1
  level = CONSTANT.LEVEL[level_index]
  level_name = CONSTANT.LEVEL_NAME[level_index]
  e.target.innerHTML = level_name
})

btnGameType.addEventListener('click', (e) => {
  game_type_index = game_type_index + 1 > CONSTANT.GAME_TYPE.length - 1 ? 0 : game_type_index + 1
  game_type = CONSTANT.GAME_TYPE[game_type_index]
  game_type_name = CONSTANT.GAME_NAME[game_type_index]
  e.target.innerHTML = game_type_name
})

btnPlay.addEventListener('click', () => {
  if (nameInput.value.trim().length > 0) {
    initSudoku()
    startGame()
    testTheCLOG()
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

const setSolutionSeed = (seed) => localStorage.setItem('solutionSeed', seed)
const getSolutionSeed = () => localStorage.getItem('solutionSeed')

const setBoardSeed = (seed) => localStorage.setItem('solutionSeed', seed)
const getBoardSeed = () => localStorage.getItem('solutionSeed')

const setKeyboardSeed = (seed) => localStorage.setItem('solutionSeed', seed)
const getKeyboardSeed = () => localStorage.getItem('solutionSeed')

const setGameSeed = (seed) => localStorage.setItem('gameSeed', seed)
const getGameSeed = () => localStorage.getItem('gameSeed')

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
  getgameSeed()

  // this is what makes the continue button on the start-screen show
  btnContinue.style.display = game ? 'grid' : 'none'

  if (getPlayerName()) {
    nameInput.value = getPlayerName()
  } else {
    nameInput.focus()
  }
}

function getgameSeed() {
  solutionSeed = getSolutionSeed() ? getSolutionSeed() : solutionSeed
  boardSeed = getBoardSeed() ? getBoardSeed() : boardSeed
  keyBoardSeed = getKeyboardSeed() ? getKeyboardSeed() : keyBoardSeed
  gameSeed = getGameSeed() ? getGameSeed() : gameSeed
  boardSeed = setSeeds('board', boardSeed, 0)
  keyBoardSeed = setSeeds('key', keyBoardSeed, 0)
  solutionSeed = setSeeds('solution', solutionSeed, gameSeed)
  gameSeed = setSeeds('gameSeed', boardSeed, gameSeed)
}

function initSudoku() {
  clearSudoku()
  clearKeyboard()
  createGrid(grid_size, game_type)

  cells = document.querySelectorAll('.main-grid-cell')
  numberInputs = document.querySelectorAll('.number')
  // resetBg()
  // Generate sudoku puzzle

  su = sudokuGen(level, grid_size, game_type, game_version, solutionSeed, boardSeed, keyBoardSeed)
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
  // createGrid(grid_size, game_type)
  // cells = document.querySelectorAll('.main-grid-cell')
  // numberInputs = document.querySelectorAll('.number')
  gridTitle.innerHTML = `GRID ${CONSTANT.GRID_TYPE[grid_index]} ${CONSTANT.GAME_NAME[game_type_index]} `
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
  for (let i = 0; i < Math.pow(grid_size, 2); i++) {
    const colorGame = game_type === 6 ? true : false
    let row = Math.floor(i / grid_size)
    let col = i % grid_size
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
    for (let i = 0; i < Math.pow(grid_size, 2); i++) {
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
  mainSudokuGrid.classList.remove(`grid-${grid_size}`)
}

function clearKeyboard() {
  if (document.querySelector('.number')) {
    for (let i = 0; i < grid_size; i++) {
      numberInputs[i].innerHTML = ''
    }
    let childDivs = document.querySelectorAll('#numbers-keys > div')
    for (var i = 0; i < childDivs.length; i++) {
      childDivs[i].remove()
    }
    numberKeys.classList.remove(`grid-${grid_size}`)
  }
}

function resetBg() {
  cells.forEach((e) => e.classList.remove('hover'))
}

function testTheCLOG() {
  console.log('-------------testTheCLOG--------------')

  console.log(grid_size_name)
  console.log(game_version_name)
  console.log(level_name)
  console.log(game_type_name)

  console.log('-------------end testTheCLOG--------------')
  console.log('-------------testTheCLOG--------------')

  console.log(grid_size)
  console.log(game_version)
  console.log(level)
  console.log(game_type)

  console.log('-------------end testTheCLOG--------------')
}

// end functions

init()
