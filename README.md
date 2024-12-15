# capstone

> [!WARNING]
> Work in progress.

capstone is a [React] renderer for [AppKit] that lets you create
native macOS apps using JavaScript.

[react]: https://react.dev
[appkit]: https://developer.apple.com/documentation/appkit

```typescript
import {run} from 'capstone';
import {useState} from 'react';

function App() {
  return <window title='hello, capstone!' />;
}

run(<App />);
```
