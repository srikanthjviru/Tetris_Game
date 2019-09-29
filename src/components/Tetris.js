import React, { useState } from "react";
import { createStage, checkCollision } from "../gameHelpers";

//custom hooks
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";
import { useInterval } from "../hooks/useInterval";
import { useGameStatus } from "../hooks/useGameStatus";

//Components
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";

//styles components
import { StyledTetrisWrapper, StyledTetris } from "./styles/StyledTetris";

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, level, setLevel, rows, setRows] = useGameStatus(
    rowsCleared
  );

  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      console.log("moving on the x-axis");
      updatePlayerPos({ x: dir, y: 0 });
    }
    return null;
  };
  const startGame = () => {
    //Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setLevel(0);
    setRows(0);
  };
  const drop = () => {
    // increase level when player clears 10 rows
    if (rows > 2) {
      setLevel(prev => prev + 1);
      //Also increase the speed
      setDropTime(1000 / (level + 1) + 200);
    }
    console.log("droping by 1 y-axis");
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      //Game over
      if (player.pos.y < 1) {
        console.log("GAME OVER");
        setGameOver(true);
        setDropTime(null);
      }
      console.log("collided now");

      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };
  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };
  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        //left arrow key
        movePlayer(-1);
      } else if (keyCode === 39) {
        //right arrow key
        movePlayer(1);
      } else if (keyCode === 40) {
        // down arrow key
        dropPlayer();
      } else if (keyCode === 38) {
        // up arrow key
        playerRotate(stage, 1);
      }
    }
  };
  useInterval(() => {
    drop();
  }, dropTime);
  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score : ${score}`} />
              <Display text={`Rows : ${rows}`} />
              <Display text={`Level : ${level}`} />
              <StartButton callback={startGame} />
            </div>
          )}
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};
export default Tetris;
