let cross =  document.createElement('img');
cross.setAttribute('src', 'graphics/cross.png');
cross.setAttribute('alt', 'Image of a cross');
cross.classList.add('choice-icon');

let circle =  document.createElement('img');
circle.setAttribute('src', 'graphics/circle.png');
circle.setAttribute('alt', 'Image of a circle');
circle.classList.add('choice-icon');

let TicTacToeGame = (function(doc, circle, cross) 
{
    let Player1 = createPlayer('Player 1', 0, cross);
    let Player2 = createPlayer('Player 2', 0, circle);
    let turn = Player1;
    let markPut = false;
    let board = doc.querySelector('.board');
    let grid = board.querySelector('.board-grid');
    let cells = Array.from(doc.querySelector('.big').querySelectorAll('.cell'));
    let logicBoard = [null, null, null, null, null, null, null, null, null];
    let boardHistory = doc.querySelector('.board-history');
    let winnerScreen = document.querySelector('.winner-screen');
    let mode = 'player';
    let computerDifficulty;
    let maxMark; 
    let minMark;

    cells.forEach( (cell) =>
    {
        cell.addEventListener('click', () => 
        {
            play(cell);
        })
    });

    setDifficulty('easy');

    function createPlayer(name, score = 0, mark = cross) 
    {
        return {
            score, mark, name
        }
    }

    function changeName(name, p) 
    {
        if(p == 0)
            Player1.name = name;
        else
            Player2.name = name;
    }

    function swapMarks(first, second) 
    {
        if(Player1.mark == first)
        {
            Player1.mark = second;
            Player2.mark = first;
            resetBoard();
            return true;
        }
        return false;
    }

    function changeMode(newMode) 
    {
        mode = newMode;
    }

    function resetBoard()
    {
        if(markPut)
        {
            addBoardToHistory()
            if(winnerScreen.style.getPropertyValue('visibility') == 'visible')
               removeWinnerScreen();
            cells.forEach( (cell) => 
            {
                if(cell.querySelector('img'))
                    cell.removeChild(cell.querySelector('img'));
            });
            swapTurn();
            markPut = false;
            logicBoard = [null, null, null, null, null, null, null, null, null];
        }
    }

    function resetHistoryBoard()
    {
        if(boardHistory.querySelector('.board'))
        {
            let boards = boardHistory.querySelectorAll('.board');
            for(let board of boards)
                boardHistory.removeChild(board);
            let p = document.createElement('p');
            p.classList.add('plhldr')
            p.textContent = "Board history";
            boardHistory.appendChild(p);
        }
    }

    function play(cell)
    {
        if(!cell.querySelector('img'))
        {
            let player = turn;
            cell.appendChild(player.mark.cloneNode(true));
            swapTurn();
            markPut = true;
            logicBoard[cell.getAttribute('data-id')] = player.mark == cross ? -1 : 1;      
            let won = checkLogic(logicBoard);
            if(won == null && mode == 'computer' && turn == Player2)
                computerPlay();
            else if(won != null && won != 0) 
                setWinnerScreen(won);
            else if(won == 0)
                setWinnerScreen('tie');
        }
    }

    function computerPlay()
    {
        let index;
        switch(computerDifficulty)
        {
            case 'easy' : 
            {
                do
                {
                    index = Math.floor(Math.random() * (8 - 0 + 1));
                }while(logicBoard[index] != null)
            }; break;

            case 'medium' : 
            {
                let number = Math.floor(Math.random() * (1 - 0 + 1));
                if(number == 1)
                {
                    do
                    {
                        index = Math.floor(Math.random() * (8 - 0 + 1));
                    }while(logicBoard[index] != null)
                }
                else 
                    index = getBestMove(logicBoard);
            }; break;

            case 'hard' : 
            {
                let number = Math.floor(Math.random() * (2 - 0 + 1));
                if(number == 1)
                {
                    do
                    {
                        index = Math.floor(Math.random() * (8 - 0 + 1));
                    }while(logicBoard[index] != null)
                }
                else 
                    index = getBestMove(logicBoard);
            }; break;

            case 'unbeatable' :
            {
                index = getBestMove(logicBoard);
            }; break;
        }

        play(doc.querySelector('.big').querySelector(`[data-id='${index}']`));
    }   

    function getBestMove() //Coded along The Coding Train tutorial https://www.youtube.com/watch?v=trKjYdBASyQ&ab_channel=TheCodingTrain
    {
        let bestScore = -Infinity
        let bestMoveIndex;
        maxMark = Player1.mark == cross ? 1 : -1; 
        minMark = -maxMark;
        for(let i = 0; i < logicBoard.length; i++)
        {
            if(logicBoard[i] == null)
            {
                logicBoard[i] = maxMark;

                let score = playMINIMAX(logicBoard, 0, false);
                logicBoard[i] = null;
                if(score > bestScore)
                {
                    bestScore = score;
                    bestMoveIndex = i;
                }
            }
        }
        logicBoard[bestMoveIndex] = 1;
        return bestMoveIndex;
    }

    function playMINIMAX(logicBoard, depth, isMaximizing) //Coded along The Coding Train tutorial https://www.youtube.com/watch?v=trKjYdBASyQ&ab_channel=TheCodingTrain
    {   
        let result = checkLogic(logicBoard);
        if(result != null)
            return result;

        if(isMaximizing)
        {
            let bestScore = -Infinity;
            for(let i = 0; i < logicBoard.length; i++)
            {
                if(logicBoard[i] == null)
                {
                    logicBoard[i] = maxMark;
    
                    let score = playMINIMAX(logicBoard, depth+1, false);
                    logicBoard[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        }
        else 
        {
            let bestScore = Infinity;
            for(let i = 0; i < logicBoard.length; i++)
            {
                let bestMoveIndex;
                if(logicBoard[i] == null)
                {
                    logicBoard[i] = minMark;
    
                    let score = playMINIMAX(logicBoard, depth+1, true);
                    logicBoard[i] = null;
                    bestScore =  Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
     
    function addBoardToHistory()
    {
        if(boardHistory.querySelector('.plhldr'))
            boardHistory.removeChild(boardHistory.querySelector('p'));
        let historyBoard = board.cloneNode(true)
        boardHistory.appendChild(historyBoard);
        let grid = historyBoard.querySelector('.board-grid');
        grid.classList.add('small');
        grid.classList.remove('big');
    }

    function checkLogic(logicBoard) 
    {
        let number;
        let won = null;
        let numbers = [-1, 1]
        for(let i = 0; i < 2; i++)
        {
            number = numbers[i];
            if(logicBoard[0] == number)
            {
                if(logicBoard[4] == number && logicBoard[8] == number)
                    won = number;
                else if(logicBoard[3] == number && logicBoard[6] == number)
                    won = number;
                else if(logicBoard[1] == number && logicBoard[2] == number)
                    won = number;
            }
            if(logicBoard[1] == number && logicBoard[4] == number && logicBoard[7] == number)
                won = number;
            else if(logicBoard[2] == number && logicBoard[5] == number && logicBoard[8] == number)
                won = number;
            else if(logicBoard[3] == number && logicBoard[4] == number && logicBoard[5] == number)
                won = number;
            else if(logicBoard[6] == number && logicBoard[7] == number && logicBoard[8] == number)
                won = number;
            else if(logicBoard[2] == number && logicBoard[4] == number && logicBoard[6] == number)
                won = number;
        }
        if(logicBoard.indexOf(null) == -1 && won == null)
            return 0;
        return won;
    }

    function setWinnerScreen(won)
    {
        let text;
        if(won != 'tie')
        {
            won = won == -1 ? cross : circle;
            let name;
            if(Player1.mark == won)
                name = Player1.name;
            else 
                name = Player2.name;
            text = `${name} won!`;
        }
        else 
        {
            text = 'Tie';
        }
        winnerScreen.querySelector('p').textContent = text;
        winnerScreen.style.setProperty('visibility', 'visible');
        grid.style.setProperty('opacity', '0.2');
    }

    function removeWinnerScreen(won)
    {
        winnerScreen.style.setProperty('visibility', 'hidden');
        grid.style.removeProperty('opacity');
    }

    function swapTurn() 
    {
        turn = turn == Player1 ? Player2 : Player1;
    }
 
    function changeTurn(p) 
    {
        turn = p == 0 ? Player1 : Player2;
    }

    function setDifficulty(difficulty) 
    {
        computerDifficulty = difficulty.toLowerCase();
        resetBoard();
        //computer play
    }

    return {
        swapMarks, resetBoard, resetHistoryBoard, changeMode, changeName, computerPlay, changeTurn, setDifficulty
    }

})(document, circle, cross)    

let circleButton = document.querySelector('#circle-button');
let crossButton = document.querySelector('#cross-button');
let resetButton = document.querySelector('#reset-button');
let resetBoardButton = document.querySelector('#reset-board-button');
let resetHistBrdButton = document.querySelector('#reset-history-button');
let playerButton = document.querySelector('#player-button');
let computerButton = document.querySelector('#computer-button');
let nameInputs = document.querySelectorAll('.player-name-input');
let dmOptions = document.querySelectorAll('.dm-option');

dmOptions.forEach( (option) => 
{
    option.addEventListener('click', () =>
    {
        dmOptions.forEach( (option) => 
        {
            if(option.classList.contains('text-menu-selected'))
                option.classList.remove('text-menu-selected');
        });
        option.classList.add('text-menu-selected');
        TicTacToeGame.setDifficulty(option.textContent);
    });
});

nameInputs.forEach( input => 
{
    input.addEventListener('input', () => 
    {
        TicTacToeGame.changeName(input.value, input.getAttribute('data-id'));
    }); 
}) 

resetBoardButton.addEventListener('click', () =>
{
    TicTacToeGame.resetBoard();
    if(circleButton.classList.contains('mode-button-selected'))
        TicTacToeGame.computerPlay();
});

resetHistBrdButton.addEventListener('click', () =>
{
    TicTacToeGame.resetHistoryBoard();
});

circleButton.addEventListener('click', () =>
{
    if(TicTacToeGame.swapMarks(cross, circle))
    {
        TicTacToeGame.changeTurn(1);
        setSelectedButton(circleButton, crossButton);
        TicTacToeGame.computerPlay();
    }
});

crossButton.addEventListener('click', () =>
{
    if(TicTacToeGame.swapMarks(circle, cross))
        setSelectedButton(crossButton, circleButton);
});

playerButton.addEventListener('click', () =>
{
    if(!playerButton.classList.contains('mode-button-selected'))
    {
        computerButton.classList.remove('go-up-animation');
        document.querySelector('.difficulty-menu').classList.add('go-down-animation');
        TicTacToeGame.changeTurn(0);
        document.querySelector('label[for="name1"]').textContent = "x player name";
        document.querySelector('label[for="name2"]').textContent = "o player name";
        crossButton.setAttribute('disabled', '');
        circleButton.setAttribute('disabled', '');
        circle.classList.remove('selectable');
        cross.classList.remove('selectable');
        setSelectedButton(playerButton, computerButton);
        TicTacToeGame.changeMode('player');
        TicTacToeGame.resetBoard();
    }
});

computerButton.addEventListener('click', () =>
{
    if(!computerButton.classList.contains('mode-button-selected'))
    {
        computerButton.classList.add('go-up-animation');
        document.querySelector('.difficulty-menu').classList.remove('go-down-animation');
        let turn = circleButton.classList.contains('mode-button-selected') ? 1 : 0;
        document.querySelector('label[for="name1"]').textContent = "Player's name";
        document.querySelector('label[for="name2"]').textContent = "Computer's name";
        crossButton.removeAttribute('disabled');
        circleButton.removeAttribute('disabled');
        circle.classList.add('selectable');
        cross.classList.add('selectable');
        setSelectedButton(computerButton, playerButton);
        TicTacToeGame.changeMode('computer');
        TicTacToeGame.resetBoard();
    }
});

resetButton.addEventListener('click', () => 
{
    TicTacToeGame.resetBoard();
    TicTacToeGame.resetHistoryBoard();
    if(circleButton.classList.contains('mode-button-selected'))
        TicTacToeGame.computerPlay();
});

function setSelectedButton(element, opposite = null)
{
    element.classList.add('mode-button-selected');
    if(opposite)
        opposite.classList.remove('mode-button-selected');
}