// script.js

const wordDisplay = document.getElementById('word-display');
const letterRows = document.getElementById('letter-rows');

let trie = {};
let currentPath = []; // Stores the currently selected letters, e.g., ['a', 'p', 'p']

// Load dictionary and build trie
fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words.txt')
  .then(res => res.text())
  .then(text => {
    const words = text.split('\n').map(w => w.trim().toLowerCase()).filter(w => /^[a-z]+$/.test(w));
    words.forEach(word => {
      let node = trie;
      for (let char of word) {
        if (!node[char]) node[char] = {};
        node = node[char];
      }
      node['$'] = true; // terminal marker
    });
    renderPath(); // Call renderPath initially to show the first column of letters
  })
  .catch(error => console.error('Error loading dictionary:', error));


function renderPath() {
  const currentWord = currentPath.join('');

  // --- Check if the current word is a terminal word ---
  let isTerminalWord = false;
  let nodeCheck = trie;
  for (let i = 0; i < currentWord.length; i++) {
    nodeCheck = nodeCheck?.[currentWord[i]];
    if (!nodeCheck) {
      break; // Path doesn't exist in trie
    }
  }
  if (nodeCheck && nodeCheck['$']) {
    isTerminalWord = true;
  }

  // --- Update word-display ---
  wordDisplay.innerHTML = ''; // Clear previous content

  if (isTerminalWord && currentWord.length > 0) { // Ensure it's a word and not empty string
    const searchLink = document.createElement('a');
    searchLink.href = `https://www.google.com/search?q=${encodeURIComponent(currentWord)}`;
    searchLink.textContent = currentWord;
    searchLink.target = '_blank'; // Open in a new tab
    searchLink.rel = 'noopener noreferrer'; // Security best practice
    wordDisplay.appendChild(searchLink);
    wordDisplay.style.cursor = 'pointer'; // Indicate it's clickable
  } else {
    wordDisplay.textContent = currentWord;
    wordDisplay.style.cursor = 'default'; // Reset cursor if not a link
  }


  letterRows.innerHTML = ''; // Clear existing columns completely

  // --- Traverse trie and render columns for the currentPath ---
  let currentNodeInTrie = trie; // Start from the root of the trie

  // This loop will build columns for each letter already selected in currentPath
  for (let i = 0; i < currentPath.length; i++) {
    const currentLetterInPath = currentPath[i];
    
    const parentNodeForThisColumn = (i === 0) ? trie : currentPath.slice(0, i).reduce((node, char) => node?.[char], trie);

    if (!parentNodeForThisColumn || !parentNodeForThisColumn[currentLetterInPath]) {
      console.warn("Path broken or invalid letter at index:", i, " Path:", currentPath.join(''));
      break;
    }

    const col = document.createElement('div');
    col.className = 'letter-column';

    const possibleLettersAtThisLevel = Object.keys(parentNodeForThisColumn).filter(k => k !== '$').sort();

    if (possibleLettersAtThisLevel.length === 0 && !parentNodeForThisColumn['$']) {
        const deadEndTile = document.createElement('div');
        deadEndTile.className = 'deadend';
        deadEndTile.textContent = 'X';
        col.appendChild(deadEndTile);
        letterRows.appendChild(col);
        return;
    }

    possibleLettersAtThisLevel.forEach(letter => {
      const tile = document.createElement('div');
      tile.className = 'letter-tile';
      tile.textContent = letter;

      let pathSegmentNode = parentNodeForThisColumn[letter];

      if (pathSegmentNode && pathSegmentNode['$']) {
        tile.classList.add('terminal');
      }

      if (letter === currentLetterInPath) {
        tile.classList.add('selected');
      }

      tile.style.flex = `1 0 ${100 / possibleLettersAtThisLevel.length}%`;
      tile.onclick = () => {
        currentPath = currentPath.slice(0, i).concat(letter);
        renderPath();
      };
      col.appendChild(tile);
    });

    letterRows.appendChild(col);
    currentNodeInTrie = parentNodeForThisColumn[currentLetterInPath];
  }

  // --- Render the NEXT possible letters column (the new current column) ---
  let nodeForNextColumn;
  if (currentPath.length === 0) {
    nodeForNextColumn = trie;
  } else {
    nodeForNextColumn = currentNodeInTrie;
  }

  if (nodeForNextColumn && Object.keys(nodeForNextColumn).some(k => k !== '$')) {
    const nextLettersCol = document.createElement('div');
    nextLettersCol.className = 'letter-column';

    const possibleNextLetters = Object.keys(nodeForNextColumn).filter(k => k !== '$').sort();

    if (possibleNextLetters.length > 0) {
      possibleNextLetters.forEach(letter => {
        const tile = document.createElement('div');
        tile.className = 'letter-tile';
        tile.textContent = letter;

        if (nodeForNextColumn[letter] && nodeForNextColumn[letter]['$']) {
          tile.classList.add('terminal');
        }

        tile.style.flex = `1 0 ${100 / possibleNextLetters.length}%`;
        tile.onclick = () => {
          currentPath.push(letter); // Extend the path
          renderPath();
        };
        nextLettersCol.appendChild(tile);
      });
    } else {
        if (!nodeForNextColumn['$']) {
            const deadEndTile = document.createElement('div');
            deadEndTile.className = 'deadend';
            deadEndTile.textContent = 'X';
            nextLettersCol.appendChild(deadEndTile);
        }
    }
    letterRows.appendChild(nextLettersCol);
  } else if (nodeForNextColumn && nodeForNextColumn['$'] && Object.keys(nodeForNextColumn).filter(k => k !== '$').length === 0) {
      // This handles the case where the current path ends in a terminal word
      // and has no further branches. No new column is rendered, visually ending the path.
  }
}