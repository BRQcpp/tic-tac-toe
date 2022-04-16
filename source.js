let TicTacToeGame = (function(doc) 
{
    let cross =  doc.createElement('img');
    cross.setAttribute('src', 'graphics/cross.png');
    cross.setAttribute('alt', 'Image of a cross');
    cross.classList.add('cross', 'choice-icon-big');

    let circle =  doc.createElement('img');
    circle.setAttribute('src', 'graphics/circle.png');
    circle.setAttribute('alt', 'Image of a circle');
    circle.classList.add('circle', 'choice-icon-big');

    let turn = false;

    let Player1 = createPlayer(0, cross);
    let Player2 = createPlayer(0, circle);

    let resetButton = doc.querySelector('#reset-button');
    let board = Array.from(doc.querySelector('.big').querySelectorAll('.cell'));
    let circleButton = doc.querySelector('#circle-button');
    let crossButton = doc.querySelector('#cross-button');

    circleButton.addEventListener('click', () =>
    {
        swapMarks(cross, circle);
    });

    crossButton.addEventListener('click', () =>
    {
        swapMarks(circle, cross);
    });

    resetButton.addEventListener('click', () => 
    {
        resetBoard();
        turn = false;
    })

    board.forEach( (cell) =>
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
        }
    }

    function resetBoard()
    {
        board.forEach( (cell) => 
        {
            if(cell.querySelector('img'))
                cell.removeChild(cell.querySelector('img'));
        });
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
        }
    }
})(document)    
