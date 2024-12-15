import {useEffect, useState} from 'react';
import {run} from 'capstone';

console.log(':3');

function useInterval(callback: () => void, ms: number) {
  useEffect(() => {
    let timer = setInterval(() => {
      callback();
    }, ms);
    return () => clearInterval(timer);
  }, [ms]);
}

function App() {
  const [text, setText] = useState('nice');

  useInterval(
    () => setText('nice' + '!'.repeat(Math.floor(Math.random() * 5) + 1)),
    50,
  );

  return <window title='hello, capstone'>{text}</window>;
}

run(<App />);
