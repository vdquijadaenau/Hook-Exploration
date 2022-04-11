import { resourceUsage } from 'process';
import { useEffect, useState } from 'react';

type Ispressed = boolean;
type EventCode = string;

interface Settings {
  watchKey: string;
}
function fromEventCode(code: EventCode): string {
  const prefixRegex = /Key|Digit/gi;
  return code.replace(prefixRegex, '');
}

function equal(watchedKey: string, eventCode: EventCode): boolean {
  return fromEventCode(eventCode).toUpperCase() === watchedKey.toUpperCase();
}
function usePressKeyObserver({ watchKey }: Settings): Ispressed {
  const [pressed, setPressed] = useState<Ispressed>(false);

  useEffect(() => {
    function handlePressStart({ code }: KeyboardEvent): void {
      if (!pressed || !equal(watchKey, code)) return;
      setPressed(true);
    }

    function handlePressfinish({ code }: KeyboardEvent): void {
      if (!pressed || !equal(watchKey, code)) return;
      setPressed(false);
    }

    document.addEventListener('keydown', handlePressStart);
    document.addEventListener('keyup', handlePressfinish);

    return () => {
      document.removeEventListener('keydown', handlePressStart);
      document.removeEventListener('keyup', handlePressfinish);
    };
  }, [watchKey, pressed, setPressed]);

  return pressed;
}

export default usePressKeyObserver;

/**
 * 
 * usage
 * import * as React from "react";
import "./styles.css";
import Button from "./Button";
import { usePressObserver } from "./usePressObserver";

export default function App() {
  const pressed = usePressObserver({ watchKey: "n" });

  return (
    <div className="App">
      <Button active={pressed} />
      <div className="instructions">
        Type the <code>n</code> key
      </div>
      <div className="credits">
        Variation on a lesson from{" "}
        <a href="https://newline.co/fullstack-react-with-typescript">
          <em>Fullstack React with TypeScript</em>
        </a>
      </div>
    </div>
  );
}

import * as React from "react";

export default function Button({ active }: { active: boolean }) {
  return (
    <a href="#" className={"button" + (active ? " active" : "")}>
      <span>\n</span>
    </a>
  );
}
 * 
 */
