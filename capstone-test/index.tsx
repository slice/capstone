import {run, useConstraints} from 'capstone';

console.log(':3');

function App() {
  const views = useConstraints<'container' | 'label'>();

  return (
    <window title='hello, capstone'>
      <view ref={views.container}>
        <label ref={views.label}>nice</label>
      </view>

      <constraint let={views.container.width} equal={300} />
      <constraint let={views.container.height} equal={100} />
    </window>
  );
}

run(<App />);
