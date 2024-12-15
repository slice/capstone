import {create} from 'capstone-reconciler';
import {run} from 'capstone';
import {useEffect} from 'react';

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

create(<App />);
run();
