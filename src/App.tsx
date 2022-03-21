import { useEffect } from 'react';
import { initialLoadOrchestrator, dispatcherStream, dispatcherAtom } from './state/actions';
import { useAtom } from 'jotai';

function App() {
  const [, dispatcher] = useAtom(dispatcherAtom);

  useEffect(() => {
    console.log('in useEffect');
    // dispatcherStream.next(initialLoadOrchestrator);
    dispatcher(initialLoadOrchestrator);
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
