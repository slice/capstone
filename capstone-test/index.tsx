import {run, useInterval} from 'capstone';
import {useState} from 'react';

console.log(':3');

function App() {
  const [text, setText] = useState('neat');

  useInterval(() => {
    setText(String(Math.random()));
  }, 100);

  return <window title='hello, capstone'>{text}</window>;
}

run(<App />);
