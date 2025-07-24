# Word Explorer

Word Explorer is an interactive web application that allows users to discover and build words from a dictionary in real-time. Starting with the first available letters, users can progressively select letters to form words, visualize valid continuations, and instantly look up completed words.

## Features

* **Interactive Word Building:** Start with a column of all possible first letters. Clicking a letter reveals a new column of all valid subsequent letters.
* **Dynamic Trie-based Dictionary:** Utilizes a Trie (prefix tree) data structure to efficiently store and look up words, ensuring that only valid word paths are presented.
* **Visual Feedback:**
    * **Selected Letters:** The currently chosen letter in a path is highlighted in blue.
    * **Terminal Words:** Tiles that complete a valid word turn black, indicating a possible stopping point.
    * **Dead Ends:** If a path leads to no further valid letters, a "X" (dead end) indicator appears.
* **Google Search Integration:** Once a full word is constructed, the word in the display area becomes a clickable link to a Google search, allowing users to quickly look up its definition or usage.
* **Responsive Design:** The column-based layout is designed to be responsive, allowing horizontal scrolling for longer words.

## How to Use

1.  **Start Exploring:** Upon loading, you'll see a column displaying all valid starting letters from the dictionary.
2.  **Build Your Word:** Click on a letter to select it. A new column will appear to its right, showing all the letters that can validly follow your current selection.
3.  **Continue or Complete:** Keep clicking letters to extend your word.
    * If a tile turns black, you've formed a valid word. The word in the display area at the top will become a clickable link to Google.
    * You can continue to build longer words even after reaching a "terminal" (black) tile, as long as valid continuations exist.
    * If you reach a "dead end" (indicated by 'X'), there are no more words that can be formed from your current path.
4.  **Modify Your Path:** Click on any letter in a previously selected column to change your word path from that point onwards.
