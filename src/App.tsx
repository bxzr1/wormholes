import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BoardPiece } from './BoardPiece';
import { template } from './template';
import { BoardPieceLayout } from './BoardPieceLayout';

function App() {
  const boardPieceArray: BoardPiece[] = template.map((description, index) => {
    return new BoardPiece(index, description);
  });

  return (
    <div className="App" style={ { display: 'flex' } }>
       { boardPieceArray.map( ( piece ) => { 
          return <BoardPieceLayout boardPiece={ piece }/>
        })
       }
    </div>
  );
}

export default App;
