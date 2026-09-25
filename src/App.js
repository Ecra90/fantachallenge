import { useEffect, useRef, useState } from "react";
import "./App.css";

const GAME_TIME = 30;

function App() {
  const [gameState, setGameState] = useState("ready");
  const [countdown, setCountdown] = useState(3);
  const [time, setTime] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("fantaHighScore")) || 0
  );

  const [position, setPosition] = useState({
    top: 50,
    left: 50,
  });

  const [catching, setCatching] = useState(false);

  const [showCatch, setShowCatch] = useState(false);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const playSound = (frequency, duration = 0.08) => {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      const audioContext = new AudioContext();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(
        audioContext.currentTime + duration
      );
    } catch {
      // Audio isn't available in some browsers.
    }
  };

  const moveTarget = () => {
    const top = Math.floor(Math.random() * 76) + 12;
    const left = Math.floor(Math.random() * 82) + 9;

    setPosition({
      top,
      left,
    });
  };

  const startGame = () => {
    clearInterval(timerRef.current);
    clearInterval(countdownRef.current);

    setScore(0);
    setCombo(0);
    setTime(GAME_TIME);
    setCountdown(3);
    setCatching(false);
    setGameState("countdown");

    playSound(500);

    let number = 3;

    countdownRef.current = setInterval(() => {
      number--;

      if (number > 0) {
        setCountdown(number);
        playSound(600 + number * 100);
      } else {
        clearInterval(countdownRef.current);

        setGameState("playing");
        moveTarget();
        playSound(900);

        startTimer();
      }
    }, 1000);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTime((current) => Math.max(current - 1, 0));
    }, 1000);
  };

  useEffect(() => {
    if (gameState === "playing" && time === 0) {
      clearInterval(timerRef.current);

      setGameState("finished");

      setHighScore((currentHighScore) => {
        const newHighScore = Math.max(
          currentHighScore,
          score
        );

        localStorage.setItem(
          "fantaHighScore",
          newHighScore
        );

        return newHighScore;
      });

      playSound(300, 0.25);
    }
  }, [time, gameState, score]);


  const catchFanta = () => {
    if (gameState !== "playing") return;

    setCatching(true);
    setShowCatch(true);

    setTimeout(() => {
      setCatching(false);
    }, 180);

    setTimeout(() => {
      setShowCatch(false);
    }, 450);

    setScore((current) => current + 100);

    setCombo((current) => current + 1);

    moveTarget();

    playSound(
      700 + Math.min(combo * 20, 300)
    );
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  const resetGame = () => {
    setGameState("ready");
    setScore(0);
    setCombo(0);
    setTime(GAME_TIME);
    setCountdown(3);
  };

  return (
    <div className="app">

      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <header className="header">

        <div className="brand">

          <div className="brand-icon">
            🍊
          </div>

          <div>
            <h1>SKIZIA UTAMU</h1>
            <p>Developer Edition</p>
          </div>

        </div>

        <div className="developer-badge">
          &lt;/&gt; ECraDev
        </div>

      </header>

      {gameState === "ready" && (
        <main className="screen">

          <div className="card">

            <div className="hero-icon">
              🍊
            </div>

            <div className="tag">
              DEVELOPER CHALLENGE
            </div>

            <h2>
              CATCH
              <br />
              THE FANTA
            </h2>

            <p>
              They gave me a challenge...
              <br />
              So I coded one. 😎
            </p>

            <div className="high-score">
              🏆 High Score: {highScore}
            </div>

            <button
              className="primary-button"
              onClick={startGame}
            >
              START CHALLENGE 🚀
            </button>

            <div className="how-to">
              <span>🎯</span>
              <span>
                Catch as many Fanta targets as
                possible in 30 seconds.
              </span>
            </div>

          </div>

        </main>
      )}

      {gameState === "countdown" && (
        <main className="countdown-screen">

          <div className="countdown-number">
            {countdown}
          </div>

          <p>
            GET READY...
          </p>

        </main>
      )}

      {gameState === "playing" && (
        <main className="game">

          <div className="stats">

            <div className="stat">
              <small>TIME</small>
              <strong>{time}s</strong>
            </div>

            <div className="stat">
              <small>SCORE</small>
              <strong>{score}</strong>
            </div>

            <div className="stat">
              <small>COMBO</small>
              <strong>
                🔥 {combo}
              </strong>
            </div>

          </div>

          <div className="game-area">

            <div className="target-shadow" />
            <button
              className={`fanta-target ${catching ? "caught" : ""
                }`}
              style={{
                top: `${position.top}%`,
                left: `${position.left}%`,
              }}
              onClick={catchFanta}
              aria-label="Catch orange target"
            >
              <div className="bottle">

                <div className="bottle-cap">
                  ✦
                </div>

                <div className="bottle-neck" />

                <div className="bottle-body">

                  <div className="bubbles">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="bottle-label">
                    <strong>ORANGE</strong>
                    <small>BURST</small>
                  </div>

                </div>

              </div>

              <div className="catch-text">
                TAP!
              </div>
            </button>

          </div>

          <div className="game-message">
            TAP IT! 🍊
          </div>

          {showCatch && (
            <div className="catch-popup">
              +100
              <span>🔥 NICE CATCH!</span>
            </div>
          )}
        </main>
      )}

      {gameState === "ready" && (
        <main className="screen">

          <div className="card">

            <div className="code-icon">
              &lt;/&gt;
            </div>

            <div className="tag">
              EcraDev PRESENTS
            </div>

            <h2>
              CHALLENGE
              <br />
              ACCEPTED.
            </h2>

            <p className="challenge-text">
              They said:
              <br />
              <strong>"Skizia Utamu."</strong>
            </p>

            <div className="developer-line">
              <span>💻</span>
              <span>Me:</span>
              <strong>Say less. 😎</strong>
            </div>

            <div className="build-preview">

              <div className="terminal-top">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="terminal-content">
                <p>
                  <span className="green">
                    $ npm run build
                  </span>
                </p>

                <p>
                  Building Fanta challenge...
                </p>

                <p className="success">
                  ✓ Challenge ready
                </p>
              </div>

            </div>

            <button
              className="primary-button"
              onClick={startGame}
            >
              LAUNCH GAME 🚀
            </button>

            <div className="high-score">
              🏆 High Score: {highScore}
            </div>

          </div>

        </main>
      )}

      <footer>
        Built by Ecra• EcraDev|Skizia Utamu Challenge
      </footer>

    </div>
  );
}

export default App;