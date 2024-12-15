import {useEffect} from 'react';

import {create} from 'capstone-reconciler';
import {subclassAppDelegate} from './delegate';

export function useInterval(callback: () => void, ms: number) {
  useEffect(() => {
    let timer = setInterval(() => {
      callback();
    }, ms);
    return () => clearInterval(timer);
  }, [ms]);
}

export function run(tree: React.ReactNode) {
  subclassAppDelegate({
    didFinishLaunching() {
      create(tree);
    },
  });

  $.NSApplication.sharedApplication.run;
}
