import {run, useConstraints} from 'capstone';
import {useReducer} from 'react';

function App() {
  const [counter, increment] = useReducer((count) => count + 1, 0);

  function handleClick() {
    console.log(':3');
    increment();
  }

  const views = useConstraints((c) => ({
    container: {width: c.gte(300), height: c.gte(200)},
    button: {},
  }));

  return (
    <window title='hello, capstone'>
      <view ref={views.container}>
        <button ref={views.button} onClick={handleClick}>
          {String(counter)}
        </button>
      </view>

      <constraint let={views.button.centerX} eq={views.container.centerX} />
      <constraint let={views.button.centerY} eq={views.container.centerY} />
    </window>
  );
}

run(<App />);
