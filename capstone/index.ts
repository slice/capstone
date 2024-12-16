import {useEffect} from 'react';
import {create} from 'capstone-reconciler';
import {
  ConstraintDescriptor,
  ConstraintDimensions,
} from 'capstone-reconciler/constraints';

import {Instance} from 'capstone-reconciler/instance';
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

export type ViewsSlot = React.RefCallback<any> & {
  [Dimension in ConstraintDimensions]: ConstraintDescriptor;
};

export type Views<Names extends string> = {[K in Names]: ViewsSlot};

export function useViews<Names extends string>(): Views<Names> {
  let storage: Record<string, {current: Instance | null}> = {};

  return new Proxy({} as Views<Names>, {
    get(_, name) {
      if (typeof name === 'symbol') throw new Error('no');
      storage[name] ??= {current: null};

      const callback: ViewsSlot = (view: any) => {
        console.log(`useViews: ${name}: got view:`, view, view.backing);
        (storage[name] ??= {current: null}).current = view;
      };

      callback.width = {attribute: 'width', ref: storage[name]};
      callback.height = {
        attribute: 'height',
        ref: storage[name],
      };

      return callback;
    },
  });
}
