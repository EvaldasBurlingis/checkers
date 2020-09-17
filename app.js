const main = document.querySelector('main');
const setBoardSize = document.querySelector('input');
const selectionBox = document.querySelector('.selection-box');

let startPositions = {
  x: 0,
  y: 0,
};

let endPositions = {
  x: 0,
  y: 0,
};

function updateStarPositionState(x, y) {
  return (startPositions = {
    x,
    y,
  });
}

function updateEndPositionState(x, y) {
  return (endPositions = {
    x,
    y,
  });
}

function createNewBoard() {
  if (Number(setBoardSize.value) < 8 || Number(setBoardSize.value) > 16) {
    alert('Minimalus laukeliu skaicius 8, maksimalus 16');
  } else {
    selectionBox.style.display = 'none';
    const size = Number(setBoardSize.value);
    setBoard(size);
  }
}

function generatePuck(color) {
  const puck = document.createElement('div');

  puck.classList.add('puck');
  puck.style.width = '3rem';
  puck.style.height = '3rem';
  puck.style.borderRadius = '50%';
  puck.style.backgroundColor = color === 'white' ? '#ed5564' : '#434a54';
  puck.style.boxShadow = `
  0 1px 1px rgba(0,0,0,0.12),
  0 2px 2px rgba(0,0,0,0.12),
  0 4px 4px rgba(0,0,0,0.12),
  0 8px 8px rgba(0,0,0,0.12),
  0 16px 16px rgba(0,0,0,0.12)
`;

  puck.setAttribute('draggable', 'true');
  puck.setAttribute('ondragstart', 'drag(event)');

  if (color === 'white') {
    puck.dataset.puck = 'white';
    puck.classList.add('puck-white');
  } else {
    puck.dataset.puck = 'black';
    puck.classList.add('puck-black');
  }
  return puck;
}

function setBoard(size) {
  main.style.border = '1rem solid rgb(106, 63, 63)';
  main.style.borderRadius = '0.5rem';
  main.style.display = 'flex';
  main.style.flexWrap = 'wrap';
  main.style.justifyContent = 'center';
  main.style.height = `${size * 60}px`;
  main.style.width = `${size * 60}px`;
  main.style.boxShadow = `
          0 1px 1px rgba(0,0,0,0.12),
          0 2px 2px rgba(0,0,0,0.12),
          0 4px 4px rgba(0,0,0,0.12),
          0 8px 8px rgba(0,0,0,0.12),
          0 16px 16px rgba(0,0,0,0.12)
  `;

  createSquares(size);
}

function createSquares(size) {
  for (let i = 1; i <= size; i++) {
    for (let j = 1; j <= size; j++) {
      const div = document.createElement('div');
      div.classList.add('square');

      div.style.display = 'flex';
      div.style.flex = '0 0 60px';
      div.style.height = '60px';
      div.style.justifyContent = 'center';
      div.style.alignItems = 'center';

      div.dataset.positionX = i;
      div.dataset.positionY = j;

      // calculate black and white squares by x and y axis
      if (i % 2 == j % 2) {
        div.dataset.square = 'white';
      } else {
        div.dataset.square = 'black';
      }
      main.appendChild(div);
    }
  }

  // Grab all squares
  const squares = Array.from(document.querySelectorAll('.square'));

  // Paint squares black and put pawns in place
  squares.map((square, index) => {
    //Paint squares and add draggable attributes
    if (square.dataset.square === 'black') {
      square.style.background = '#a85d5d';
      square.setAttribute('id', `square-black-${index + 1}`);
      square.setAttribute('ondrop', 'drop(event)');
      square.setAttribute('ondragover', 'allowDrop(event)');
    } else {
      square.style.background = '#ffd2a6';
    }

    // Calculate how many rows will have pucks on them
    const rowsWithPawns = size % 2 === 0 ? (size - 2) / 2 : (size - 1) / 2;

    // Put pucks on table
    if (
      square.dataset.positionX <= rowsWithPawns &&
      square.dataset.square === 'black'
    ) {
      square.appendChild(generatePuck('white'));
    } else if (
      Number(square.dataset.positionX) > size - rowsWithPawns &&
      square.dataset.square === 'black'
    ) {
      square.appendChild(generatePuck('black'));
    }
  });

  // add id to pucks
  const whitePucks = Array.from(document.querySelectorAll('.puck-white'));
  const blackPucks = Array.from(document.querySelectorAll('.puck-black'));

  addIdToElements(whitePucks, 'puck-white');
  addIdToElements(blackPucks, 'puck-black');

  // Map puck start position before drag started
  const pucks = Array.from(document.querySelectorAll('.puck'));
  pucks.map((puck) => {
    puck.addEventListener('mousedown', (e) => {
      const startingSquare = e.originalTarget.parentElement;

      updateStarPositionState(
        startingSquare.dataset.positionX,
        startingSquare.dataset.positionY
      );
    });
  });
}

function addIdToElements(elementsArr, id) {
  return elementsArr.map((element, idx) =>
    element.setAttribute('id', `${id}-${idx + 1}`)
  );
}

function allowDrop(ev) {
  ev.preventDefault();
  const targetSquare = ev.originalTarget;
  updateEndPositionState(
    targetSquare.dataset.positionX,
    targetSquare.dataset.positionY
  );
}

function drag(ev) {
  console.log('drag started');
  ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
  const isDropAllowed = checkIfDropAllowed(startPositions, endPositions);

  if (isDropAllowed) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData('text');
    ev.target.appendChild(document.getElementById(data));
    // console.log(`Start posx: ${startPositions.x}, posy: ${startPositions.y}`);
    // console.log(`End posx: ${endPositions.x}, posy: ${startPositions.y}`);
    updateStarPositionState(0, 0);
    updateEndPositionState(0, 0);
  } else {
    alert('illegal');
  }
}

function checkIfDropAllowed(src, target) {
  const start = {
    x: Number(src.x),
    y: Number(src.y),
  };

  const end = {
    x: Number(target.x),
    y: Number(target.y),
  };

  if (
    (start.y + 1 === end.y && start.x - 1 === end.x) ||
    start.x + 1 === end.x
  ) {
    return true;
  }

  return false;
}
