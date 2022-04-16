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

    let Player1 = createPlayer(0, cross);
    let Player2 = createPlayer(0, circle);
    let board = doc.querySelector('.board');
    let cells = Array.from(doc.querySelector('.big').querySelectorAll('.cell'));
    let boardHistory = doc.querySelector('.board-history');

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

    function resetBoard()
    {
        if(markPut)
        {
            addBoardToHistory()
            cells.forEach( (cell) => 
            {
                if(cell.querySelector('img'))
                    cell.removeChild(cell.querySelector('img'));
            });
            turn = false;
            markPut = false;
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
            p.textContent = "Board history";
            boardHistory.appendChild(p);
        }
    }

    function createPlayer(score = 0, mark = cross) 
    {
        return {
            score, mark
        }
    }

    function play(cell)
    {
        if(!cell.querySelector('img'))
        {
            if(turn == false)
                cell.appendChild(Player1.mark.cloneNode(true));
            else
                cell.appendChild(Player2.mark.cloneNode(true));
            turn = !turn;
            markPut = true;
        }
    }

    function addBoardToHistory()
    {
        if(boardHistory.querySelector('p'))
            boardHistory.removeChild(boardHistory.querySelector('p'));
        let historyBoard = board.cloneNode(true)
        boardHistory.appendChild(historyBoard);
        let grid = historyBoard.querySelector('.board-grid');
        grid.classList.add('small');
        grid.classList.remove('big');
    }

    return {
        swapMarks, resetBoard, resetHistoryBoard
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
    //if(TicTacToeGame.swapMarks(circle, cross))
        setSelectedButton(playerButton, computerButton);
});

computerButton.addEventListener('click', () =>
{
    //if(TicTacToeGame.swapMarks(circle, cross))
        setSelectedButton(computerButton, playerButton);
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
