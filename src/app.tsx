import { useEffect, useState } from "preact/hooks";
import "./app.css";
import { Tomato } from "./Tomato";

type Mode = "pomo" | "break";

const timerTotals: Record<Mode, number> = {
  pomo: 25 * 60,
  break: 5 * 60,
};

const flip = (mode: Mode): Mode => (mode === "pomo" ? "break" : "pomo");

/** Slow down / speed up reality */
const COUNTDOWN_INTERVAL = 1;

type CountdownProps = {
  secondsRemaining: number;
};

function Countdown({ secondsRemaining }: CountdownProps) {
  const fmtTime = (secondsRemaining: number) => {
    const mins = Math.floor(secondsRemaining / 60);
    let secs = secondsRemaining % 60;
    if (secs === 0) {
      return `${mins}:00`;
    } else if (secs < 10) {
      return `${mins}:0${secs}`;
    } else {
      return `${mins}:${secs % 60}`;
    }
  };
  return (
    <div class="countdown">
      <h2>{fmtTime(secondsRemaining)}</h2>
    </div>
  );
}

export function App() {
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState<Mode>("pomo");
  const [secondsRemaining, setSecondsRemaining] = useState(timerTotals[mode]);

  useEffect(() => {
    const tid = setInterval(() => {
      if (!isPaused) {
        if (secondsRemaining < 1) {
          const newMode = flip(mode);
          setSecondsRemaining(timerTotals[newMode]);
          setMode(newMode);
        } else {
          setSecondsRemaining((s) => s - 1);
        }
      }
    }, COUNTDOWN_INTERVAL);

    return () => {
      clearInterval(tid);
    };
  }, [secondsRemaining, setSecondsRemaining, setMode, mode, isPaused]);

  const colour = mode === "pomo" ? "rgb(180,0,0)" : "green";
  const pct = (1 - secondsRemaining / timerTotals[mode]) * 100;

  return (
    <>
      <div class="card">
        <h1>pomo</h1>
      </div>
      <div class="card">
        <div class="tomato-container">
          <div class="tomato">
            <Tomato fill={colour} />
          </div>
          <div
            class="mask"
            style={{
              background: `conic-gradient(white ${pct}%, transparent ${pct}%)`,
            }}
          ></div>
        </div>
      </div>
      <div class="card">
        <h2
          class="explainer"
          style={{
            color: colour,
          }}
        >
          {mode === "pomo" ? "It's focus time" : "5 minute breaking"}
        </h2>
      </div>
      <Countdown secondsRemaining={secondsRemaining} />
      <button class="pause-button" onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "Start" : "Stop"}
      </button>
    </>
  );
}
