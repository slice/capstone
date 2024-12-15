import {create} from '../capstone-reconciler';
import {subclassAppDelegate} from './delegate';

export function run(tree: React.ReactNode) {
  subclassAppDelegate({
    didFinishLaunching() {
      create(tree);
    },
  });

  $.NSApplication.sharedApplication.run;
}
