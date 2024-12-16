import {
  CONSTRAINT_ANCHORS,
  CONSTRAINT_DIMENSIONS,
  CONSTRAINT_RELATIONS,
  ConstraintConstant,
  ConstraintDescriptor,
  ConstraintDimensions,
  ConstraintRelation,
  ConstraintRightSide,
  ConstraintTarget,
  ConstraintTypes,
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
  [Dimension in ConstraintTypes]: ConstraintDescriptor;
};

export type Inequalities = {
  [K in ConstraintRelation]: (target: ConstraintTarget) => ConstraintRightSide;
};

export function useConstraints<Names extends string>(
  makeInitialConstraints: (inequalities: Inequalities) => {
    [Name in Names]: {
      [Dimension in ConstraintTypes]?: ConstraintConstant | ConstraintRightSide;
    };
  },
): ConstraintsMap<Names> {
  let map: Record<string, {current: Instance | null}> = {};

  return new Proxy({} as ConstraintsMap<Names>, {
    get(_, name) {
      // TODO: this is hairy, pull it out into a separate function
      if (typeof name === 'symbol') throw new Error('no');
      map[name] ??= {current: null};

      let initialConstraints = makeInitialConstraints({
        eq: (target) => ({target, type: 'eq'}),
        gte: (target) => ({target, type: 'gte'}),
        lte: (target) => ({target, type: 'lte'}),
      });

      if (!(name in initialConstraints)) {
        throw new Error(`useConstraints: Unknown constraint ${name}`);
      }

      const callback = ((view: Instance) => {
        if (!(name in map))
          throw new Error(
            `useConstraints: ${name} is somehow missing in the map when the ref callback was invoked`,
          );

        map[name]!.current = view;

        if (!view || view.is === 'text') return;

        let constraints = initialConstraints[name as Names];
        for (let [attribute, target] of Object.entries(constraints)) {
          // TODO: cache these, don't always create them
          let rightSide: ConstraintRightSide =
            typeof target === 'number' ? {type: 'eq', target} : target;
          // @ts-expect-error
          let constraint = createConstraint({
            let: {
              attribute: attribute as ConstraintDimensions,
              ref: map[name]!,
            },
            [rightSide.type]: rightSide.target,
          });

          (constraint as any).active = true;
        }
      }) as ConstraintsMapSlot;

      // sigh
      const allConstraintTypes: string[] = CONSTRAINT_ANCHORS.concat(
        ...(CONSTRAINT_DIMENSIONS as any),
      );

      for (const dimension of allConstraintTypes) {
        (callback as any)[dimension] = {
          attribute: dimension as ConstraintTypes,
          ref: map[name],
        } satisfies ConstraintDescriptor;
      }

      return callback;
    },
  });
}
