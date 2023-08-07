import React, { useState, useEffect } from "react";
import { Select, Button, Badge, Space, Divider, Modal } from "antd";
import "./game.css"; // Apply your styling here
import Board from "./Board";
import Lottie from "react-lottie";

const Game = () => {
  const [numCards, setNumCards] = useState(null); // Initial number of cards
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFailed, setIsGameFailed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null); // Time in seconds

  useEffect(() => {
    if (numCards !== null) {
      if (score === numCards / 2) {
        setIsGameWon(true);
      }
    }
  }, [score]);

  useEffect(() => {
    generateCards();
  }, [numCards]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      checkMatch();
    }
  }, [flippedIndices]);

  const generateCards = () => {
    const symbols = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const shuffledSymbols = symbols.sort(() => Math.random() - 0.5);
    const selectedSymbols = shuffledSymbols.slice(0, numCards / 2);
    const newCards = [...selectedSymbols, ...selectedSymbols].sort(
      () => Math.random() - 0.5
    );

    setCards(
      newCards.map((value) => ({
        value,
        flipped: false
      }))
    );
  };

  const onCardClick = (index) => {
    if (!cards[index].flipped && flippedIndices.length < 2) {
      setFlippedIndices([...flippedIndices, index]);
      flipCard(index);
    }
  };

  const flipCard = (index) => {
    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);
  };

  const checkMatch = () => {
    const [index1, index2] = flippedIndices;
    if (cards[index1].value === cards[index2].value) {
      setScore(score + 1); // Add points for matching pair
      setFlippedIndices([]);
    } else {
      setAttempts(attempts + 1);
      setTimeout(() => {
        const updatedCards = [...cards];
        updatedCards[index1].flipped = false;
        updatedCards[index2].flipped = false;
        setCards(updatedCards);
        setFlippedIndices([]);
      }, 1000);
    }

    if (score + 1 === numCards / 2) {
      setIsGameWon(true);
      setScore(0);
      setAttempts(0);
      setFlippedIndices([]);
      generateCards();
      setIsGameStarted(false);
      setTimeRemaining(null);
      setNumCards(null);
    }
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setFlippedIndices([]);
    generateCards();
    setIsGameStarted(false);
    setTimeRemaining(null);
    setNumCards(null);
  };

  const filterOption = (input, option) => {
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  };

  const filterOptionFotDuration = (input, option) => {
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  };

  useEffect(() => {
    if (timeRemaining === 0) {
      setIsGameFailed(true);
      setIsGameStarted(false);
      setScore(0);
      setAttempts(0);
      setFlippedIndices([]);
      generateCards();
      setTimeRemaining(null);
      setNumCards(null);
    } else if (isGameStarted) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(timer); // Clear the timer on component unmount or re-render
      };
    }
  }, [timeRemaining, isGameStarted]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("./failed.json"), // Provide the animation JSON path
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  const defaultOptionsWin = {
    loop: true,
    autoplay: true,
    animationData: require("./win_game.json"), // Provide the animation JSON path
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="game">
      <h1>Memory Matching Game</h1>
      <Space
        style={{
          flexWrap: "wrap"
        }}
      >
        {!isGameStarted ? (
          <>
            <Select
              showSearch
              placeholder="Difficulty level"
              optionFilterProp="children"
              onChange={(e) => {
                setNumCards(parseInt(e));
              }}
              // onSearch={onSearch}
              filterOption={filterOption}
              options={[
                {
                  value: "4",
                  label: "Easy (4 cards)"
                },
                {
                  value: "8",
                  label: "Medium (8 cards)"
                },
                {
                  value: "12",
                  label: "Hard (12 cards)"
                },
                {
                  value: "16",
                  label: "Very Hard (16 cards)"
                }
              ]}
            />

            <Select
              showSearch
              placeholder="Set duration"
              optionFilterProp="children"
              onChange={(e) => {
                setTimeRemaining(parseInt(e));
              }}
              // onSearch={onSearch}
              filterOption={filterOptionFotDuration}
              options={[
                {
                  value: "10",
                  label: "10"
                },
                {
                  value: "20",
                  label: "20"
                },
                {
                  value: "30",
                  label: "30 (Recommended)"
                },
                {
                  value: "40",
                  label: "40"
                },
                {
                  value: "50",
                  label: "50"
                },
                {
                  value: "60",
                  label: "60"
                }
              ]}
            />
            <Button
              disabled={!numCards && !timeRemaining}
              type="primary"
              onClick={() => setIsGameStarted(true)}
            >
              {isGameStarted ? "Started" : "Start game"}
            </Button>
          </>
        ) : (
          <Button type="primary" danger onClick={resetGame}>
            Reset game
          </Button>
        )}
      </Space>

      {isGameStarted && (
        <>
          <Divider />
          <Space>
            <p>
              Score:
              <Badge
                className="site-badge-count-109"
                count={score === 0 ? "0" : score}
                style={{
                  backgroundColor: "#52c41a"
                }}
              />
            </p>
            <p>
              Attempts:
              <Badge
                className="site-badge-count-109"
                count={attempts === 0 ? "0" : attempts}
                style={{
                  backgroundColor: "red"
                }}
              />
            </p>
          </Space>
          <div className="timer">Time Remaining: {timeRemaining} seconds</div>
        </>
      )}

      <Divider />
      {isGameStarted ? (
        <Board cards={cards} onCardClick={onCardClick} />
      ) : (
        <div
          style={{
            textAlign: "center"
          }}
        >
          <p
            style={{
              fontSize: 20,
              fontWeight: 600,
              fontFamily: "poppins"
            }}
          >
            Start the game
          </p>
        </div>
      )}

      <Modal
        // title="Basic Modal"
        footer
        open={isGameWon}
        onCancel={() => setIsGameWon(false)}
      >
        <div
          style={{
            textAlign: "center"
          }}
        >
          <p
            style={{
              fontSize: 20,
              fontWeight: 600,
              fontFamily: "poppins"
            }}
          >
            Yay! you won the game<span>🥳</span>
          </p>
        </div>
        <Lottie options={defaultOptionsWin} height={200} width={200} />
      </Modal>
      <Modal
        // title="Basic Modal"
        open={isGameFailed}
        onCancel={() => setIsGameFailed(false)}
        onOk={() => setIsGameFailed(false)}
        footer
      >
        <div
          style={{
            textAlign: "center"
          }}
        >
          <p
            style={{
              fontSize: 20,
              fontWeight: 600,
              fontFamily: "poppins"
            }}
          >
            Lag gyi na! <span>🤣</span>
          </p>
        </div>
        <Lottie options={defaultOptions} height={200} width={200} />
      </Modal>
    </div>
  );
};

export default Game;
