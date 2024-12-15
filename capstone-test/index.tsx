import {useEffect} from 'react';
import {run} from 'capstone';

console.log(':3');

function App() {
  useEffect(() => {
    let timer = setInterval(() => {
      console.log('\\o/');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <window />;
}

run(<App />);
