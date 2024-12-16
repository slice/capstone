import {
  CONSTRAINT_DIMENSIONS,
  ConstraintConstant,
  ConstraintDescriptor,
  ConstraintDimensions,
  createConstraint,
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

export function useConstraints<Names extends string>(initialConstraints: {
  [Name in Names]: {
    [Dimension in ConstraintDimensions]?: ConstraintConstant;
  };
}): ConstraintsMap<Names> {
  let map: Record<string, {current: Instance | null}> = {};

  return new Proxy({} as ConstraintsMap<Names>, {
    get(_, name) {
      // TODO: this is hairy, pull it out into a separate function
      if (typeof name === 'symbol') throw new Error('no');
      map[name] ??= {current: null};

      if (!(name in initialConstraints)) {
        throw new Error(`useConstraints: Unknown constraint ${name}`);
      }

      const callback = ((view: Instance) => {
        if (!(name in map))
          throw new Error(
            `useConstraints: ${name} is somehow missing in the map when the ref callback was invoked`,
          );

        map[name]!.current = view;

        if (!view) return;

        let constraints = initialConstraints[name as Names];
        for (let [attribute, constant] of Object.entries(constraints)) {
          // TODO: cache these, don't always create them
          let constraint = createConstraint({
            let: {
              attribute: attribute as ConstraintDimensions,
              ref: map[name]!,
            },
            equal: constant,
          });

          (constraint as any).active = true;
        }
      }) as ConstraintsMapSlot;

      for (const dimension of CONSTRAINT_DIMENSIONS) {
        callback[dimension] = {attribute: dimension, ref: map[name]};
      }

      return callback;
    },
  });
}
