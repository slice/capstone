import {create} from 'capstone-reconciler';
import {run} from 'capstone';
import {Window} from 'capstone-reconciler/intrinsic';
import {useEffect, useReducer} from 'react';

console.log(':3');

function App() {
  let [, rerender] = useReducer(() => true, false);

  useEffect(() => {
    let timer = setInterval(() => {
      console.log('\\o/');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <Window />;
}

create(<App />);
console.log('create() done, running');
run();
