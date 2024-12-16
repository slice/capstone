import {
  CONSTRAINT_DIMENSIONS,
  ConstraintDescriptor,
  ConstraintDimensions,
} from 'capstone-reconciler/constraints';
import {Instance} from 'capstone-reconciler/intrinsic';

/**
 * an object of arbitrarily named constraints
 */
export type ConstraintsMap<Names extends string> = {
  [K in Names]: ConstraintsMapSlot;
};

/**
 * slots:
 *
 * - are ref callbacks: `<view ref={map.slot} />`
 * - contain constraint descriptors: `<constraint let={map.slot.width} equal={100} />`
 */
export type ConstraintsMapSlot = React.RefCallback<any> & {
  [Dimension in ConstraintDimensions]: ConstraintDescriptor;
};

export function useConstraints<Names extends string>(): ConstraintsMap<Names> {
  let map: Record<string, {current: Instance | null}> = {};

  return new Proxy({} as ConstraintsMap<Names>, {
    get(_, name) {
      if (typeof name === 'symbol') throw new Error('no');
      map[name] ??= {current: null};

      const callback = ((view: Instance) => {
        console.log(`useViews: ${name}: got view:`, view, view.backing);

        if (!(name in map))
          throw new Error(
            `useConstraints: ${name} is somehow missing in the map when the ref callback was invoked`,
          );

        map[name]!.current = view;
      }) as ConstraintsMapSlot;

      for (const dimension of CONSTRAINT_DIMENSIONS) {
        callback[dimension] = {attribute: dimension, ref: map[name]};
      }

      return callback;
    },
  });
}
