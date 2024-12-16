import {run, useConstraints} from 'capstone';
import {useReducer} from 'react';

function App() {
  const [counter, increment] = useReducer((count) => count + 1, 0);

  function handleClick() {
    console.log(':3');
    increment();
  }

  const views = useConstraints({
    container: {width: 300, height: 100},
  });

  return (
    <window title='hello, capstone'>
      <view ref={views.container}>
        <button onClick={handleClick}>{String(counter)}</button>
      </view>
    </window>
  );
}

run(<App />);
