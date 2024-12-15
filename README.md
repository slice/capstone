# capstone

> [!WARNING]
> Work in progress. Not ready for production use.

<img src='https://b2.skip.lol/capstone.png' align='right' width='325' />

capstone is a [React] renderer for [AppKit] that lets you create
native macOS apps using JavaScript.

[react]: https://react.dev
[appkit]: https://developer.apple.com/documentation/appkit

```typescript
import {run} from 'capstone';
import {useState} from 'react';

function App() {
  return <window title='my cool app'>hello from capstone</window>;
}

run(<App />);
```

When you use capstone, your code runs inside of the [Open Scripting
Architecture][osa] via [JavaScriptCore][jsc], which is shared with the onboard
installation of Safari on the system. capstone abstracts over the [Objective-C
bridge][bridge], directly interacting with system frameworks from JavaScript.

[jsc]: https://developer.apple.com/documentation/javascriptcore?language=objc
[bridge]: https://developer.apple.com/library/archive/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW17
[osa]: https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/HowMacScriptingWorks.html
