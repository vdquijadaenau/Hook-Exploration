import { useEffect, useState } from 'react';

export type Status = 'iddle' | 'loading' | 'ready' | 'error';
export type ScriptElt = HTMLScriptElement | null;

function useScript(source: string): Status {
  const [status, setStatus] = useState<Status>(source ? 'loading' : 'iddle');

  useEffect(() => {
    if (!source) {
      setStatus('iddle');
      return;
    }
    let script: ScriptElt = document.querySelector(`script[src="${source}]`);

    if (!script) {
      // Create script
      script = document.createElement('script');
      script.src = source;
      script.async = true;
      script.setAttribute('data-status', 'loading');
      // Add script to document body
      document.body.appendChild(script);

      const setAttributeFromEvent = (event: Event) => {
        script?.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error');
      };

      script.addEventListener('load', setAttributeFromEvent);
      script.addEventListener('error', setAttributeFromEvent);
    } else {
      // Grab existing script status from attribute and set to state
      setStatus(script.getAttribute('data-status') as Status);
    }
    // Script event handler to update status in state
    // Note: Even if the script already exists we still need to add
    // event handlers to update the state for *this* hook instance.
    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === 'load' ? 'ready' : 'error');
    };

    // Add event listeners
    script.addEventListener('load', setStateFromEvent);
    script.addEventListener('error', setStateFromEvent);

    //clean up
    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent);
        script.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [source]);

  return status;
}

export default useScript;
