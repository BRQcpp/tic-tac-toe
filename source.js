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
    let turn = false;
    let markPut = false;
    let Player1 = createPlayer('Player 1', 0, cross);
    let Player2 = createPlayer('Player 2', 0, circle);
    let board = doc.querySelector('.board');
    let grid = board.querySelector('.board-grid');
    let cells = Array.from(doc.querySelector('.big').querySelectorAll('.cell'));
    let logicBoard = [null, null, null, null, null, null, null, null, null];
    let boardHistory = doc.querySelector('.board-history');
    let winnerScreen = document.querySelector('.winner-screen');
    let mode = 'player';
    let computerDifficulty = 'easy';

    cells.forEach( (cell) =>
    {
        cell.addEventListener('click', () => 
        {
            play(cell);
        })
    });

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
        if(newMode == 'computer')
            Player2.name = 'Computer';
        else 
            Player2.name = 'Player2';
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
            turn = false;
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

    function createPlayer(name, score = 0, mark = cross) 
    {
        return {
            score, mark, name
        }
    }

    function play(cell)
    {
        if(!cell.querySelector('img'))
        {
            let player = turn == false ? Player1 : Player2;
            cell.appendChild(player.mark.cloneNode(true));
            turn = !turn;
            markPut = true;
            logicBoard[cell.getAttribute('data-id')] = player.mark == cross ? 0 : 1;      
            checkLogic();
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

            case 'unbeatable' :
            {

            }; break;
        }

        play(doc.querySelector('.big').querySelector(`[data-id='${index}']`));
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

    function checkLogic() 
    {
        let number;
        let won = null;
        let numbers = [0, 1]
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
            if(won != null) 
            {
                setWinnerScreen(won);
                break;
            }
            if(mode == 'computer' && turn == true)
                computerPlay();
        }
    }

    function setWinnerScreen(won)
    {
        won = won == 0 ? cross : circle;
        let name;
        if(Player1.mark == won)
            name = Player1.name;
        else 
            name = Player2.name;
        
        winnerScreen.querySelector('p').textContent = `${name} won!`;
        winnerScreen.style.setProperty('visibility', 'visible');
        grid.style.setProperty('opacity', '0.2');
    }

    function removeWinnerScreen(won)
    {
        winnerScreen.style.setProperty('visibility', 'hidden');
        grid.style.removeProperty('opacity');
    }

    return {
        swapMarks, resetBoard, resetHistoryBoard, changeMode
    }

})(document, circle, cross)    

let circleButton = document.querySelector('#circle-button');
let crossButton = document.querySelector('#cross-button');
let resetButton = document.querySelector('#reset-button');
let resetBoardButton = document.querySelector('#reset-board-button');
let resetHistBrdButton = document.querySelector('#reset-history-button');
let playerButton = document.querySelector('#player-button');
let computerButton = document.querySelector('#computer-button');

resetBoardButton.addEventListener('click', () =>
{
    TicTacToeGame.resetBoard();
});

resetHistBrdButton.addEventListener('click', () =>
{
    TicTacToeGame.resetHistoryBoard();
});

circleButton.addEventListener('click', () =>
{
    if(TicTacToeGame.swapMarks(cross, circle))
        setSelectedButton(circleButton, crossButton);
});

crossButton.addEventListener('click', () =>
{
    if(TicTacToeGame.swapMarks(circle, cross))
        setSelectedButton(crossButton, circleButton);
});

playerButton.addEventListener('click', () =>
{
    if(!playerButton.classList.contains('mode-button-selected'))
        setSelectedButton(playerButton, computerButton);
    TicTacToeGame.changeMode('player');
    TicTacToeGame.resetBoard();
});

computerButton.addEventListener('click', () =>
{
    if(!computerButton.classList.contains('mode-button-selected'))
        setSelectedButton(computerButton, playerButton);
    TicTacToeGame.changeMode('computer');
    TicTacToeGame.resetBoard();
});

resetButton.addEventListener('click', () => 
{
    TicTacToeGame.resetBoard();
    TicTacToeGame.resetHistoryBoard();
});

function setSelectedButton(element, opposite = null)
{
    element.classList.add('mode-button-selected');
    if(opposite)
        opposite.classList.remove('mode-button-selected');
}
