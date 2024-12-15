export type AppDelegate = {
  didFinishLaunching: () => void;
};

export function subclassAppDelegate({didFinishLaunching}: AppDelegate) {
  ObjC.import('Cocoa');

  ObjC.registerSubclass({
    name: 'CapstoneAppDelegate',
    superclass: 'NSObject',
    methods: {
      'applicationDidFinishLaunching:': {
        types: ['void', ['NSNotification']],
        implementation: function () {
          didFinishLaunching();
        },
      },
    },
  });

  let delegateInstance = $.CapstoneAppDelegate.alloc.init;
  $.NSApplication.sharedApplication.delegate = delegateInstance;
}
