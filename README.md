# capstone

> [!WARNING]
> Work in progress. Not ready for production use. Caveat emptor, etc. etc.

<img src='https://b2.skip.lol/capstone.png' align='right' width='325' />

capstone is a [React] renderer for [AppKit] that lets you create
native macOS apps using JavaScript.

[react]: https://react.dev
[appkit]: https://developer.apple.com/documentation/appkit

```tsx
import {run} from 'capstone';

function App() {
  return (
    <window title='my cool app'>
      hello from capstone
    </window>
  );
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

A manual bridge implementation written in [Rust] or [Swift] is being considered.

[rust]: https://www.rust-lang.org
[swift]: https://www.swift.org

Hot reloading with [Fast Refresh][fast-refresh] and use of [Vite's environment
API][vite-envs] are planned.

[vite-envs]: https://vite.dev/guide/api-environment
[fast-refresh]: https://reactnative.dev/docs/fast-refresh

## idc that it's unstable, i wanna use it

If you have [Nix] installed, then the included [flake] exposes a `devShell` for
you. Otherwise, install [pnpm] yourself, and run:

```
pnpm test
```

[pnpm]: https://pnpm.io
[flake]: https://wiki.nixos.org/wiki/Flakes
[nix]: https://nixos.org
