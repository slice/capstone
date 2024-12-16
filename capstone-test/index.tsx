import {run, useConstraints} from 'capstone';
import {useReducer} from 'react';

function App() {
  const [counter, increment] = useReducer((count) => count + 1, 0);
  const views = useConstraints<'container' | 'label'>();

  function handleClick() {
    console.log(':3');
    increment();
  }

  return (
    <window title='hello, capstone'>
      <view ref={views.container}>
        <button onClick={handleClick}>{String(counter)}</button>
      </view>

      <constraint let={views.container.width} equal={300} />
      <constraint let={views.container.height} equal={100} />
    </window>
  );
}

run(<App />);
