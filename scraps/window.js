#!/usr/bin/env osascript -l JavaScript

// https://gist.github.com/Tschrock/b4c802fd981512edb0a0090e2555430e

// Creating a window in JXA, without needing to save the script as a stay-open application in Script Editor

// References:
// - https://developer.apple.com/library/archive/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html
// - https://sarunw.com/posts/how-to-create-macos-app-without-storyboard/
// - https://gist.github.com/search?q=user%3Auchcode+jxa
// - https://stackoverflow.com/questions/32555933/programmatically-creating-and-populating-a-nswindow-using-jxa

ObjC.import('Cocoa');

// Create an AppDelegate
ObjC.registerSubclass({
  name: 'AppDelegate',
  superclass: 'NSObject',
  // For some reason we can't specify the protocol here,
  // so we have to specify the types for our delegates manually
  // execution error: Error: Error: protocol does not exist (-2700)
  // protocols: ['NSApplicationDelegate'],
  methods: {
    'applicationDidFinishLaunching:': {
      types: ['void', ['NSNotification']],
      implementation: function (_notification) {
        $.NSLog('Application finished launching');

        // Create a new window
        const window =
          $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer(
            $.NSMakeRect(0, 0, 400, 400),
            $.NSTitledWindowMask |
              $.NSWindowStyleMaskClosable |
              $.NSWindowStyleMaskMiniaturizable |
              $.NSFullSizeContentViewWindowMask,
            $.NSBackingStoreBuffered,
            false,
          );

        // Set window props
        window.center;
        window.opaque = false;
        window.title = 'Fancy JXA Window';
        window.titlebarAppearsTransparent = true;
        window.movableByWindowBackground = true;

        // Show the window
        window.makeKeyAndOrderFront($());
      },
    },
    'applicationShouldTerminateAfterLastWindowClosed:': {
      types: ['bool', ['NSApplication']],
      implementation: function (_application) {
        return true;
      },
    },
  },
});

function run(_argv) {
  // Create the shared application
  const nsApp = $.NSApplication.sharedApplication;

  // Create our AppDelegate
  const appDelegate = $.AppDelegate.alloc.init;

  // Attach our delegate
  nsApp.delegate = appDelegate;

  // Run the app lifecycle
  nsApp.run;
}
