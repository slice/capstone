import {inspect} from 'capstone-bridge/introspection';
import {Instance, IntrinsicElementProps} from './intrinsic';

export const CONSTRAINT_DIMENSIONS = ['width', 'height'] as const;
export const CONSTRAINT_ANCHORS = [
  'centerX',
  'centerY',
  'leading',
  'trailing',
  'top',
  'bottom',
] as const;

export type ConstraintConstant = number;

export type ConstraintDimensions = (typeof CONSTRAINT_DIMENSIONS)[number];
export type ConstraintAnchors = (typeof CONSTRAINT_ANCHORS)[number];
export type ConstraintTypes = ConstraintAnchors | ConstraintDimensions;
export type ConstraintTarget = ConstraintConstant | ConstraintDescriptor;

export const CONSTRAINT_RELATIONS = ['eq', 'gte', 'lte'] as const;
export type ConstraintRelation = (typeof CONSTRAINT_RELATIONS)[number];

export type ConstraintRightSide = {
  type: ConstraintRelation;
  target: ConstraintTarget;
};

/**
 * a descriptor specifies a certain dimension and stashes a ref-like object to
 * the relevant view
 */
export type ConstraintDescriptor = {
  [Dimension in ConstraintTypes]: {
    attribute: Dimension;
  };
}[ConstraintTypes] & {
  ref: {current: Instance | null};
};

const NAME_TO_ANCHORS = {
  width: 'widthAnchor',
  height: 'heightAnchor',
  centerX: 'centerXAnchor',
  centerY: 'centerYAnchor',
  leading: 'leadingAnchor',
  trailing: 'trailingAnchor',
  top: 'topAnchor',
  bottom: 'bottomAnchor',
};

function descriptionToAnchor(description: ConstraintDescriptor): unknown {
  let instance = description.ref.current;
  if (!instance)
    throw new Error(
      'descriptionToAnchor: attempted to resolve anchor for null instance',
    );

  if (instance.is === 'text')
    throw new Error(
      'descriptionToAnchor: attempted to attach constraint to text instance',
    );

  let backing: unknown = instance.backing;

  if (description && !(backing as any).__window_contentView__)
    (backing as any).translatesAutoresizingMaskIntoConstraints = false;

  let anchor = (backing as any)[NAME_TO_ANCHORS[description.attribute]];

  if (!anchor)
    throw new Error(
      `descriptionToAnchor: failed to resolve constraint descriptor ${description.attribute} to corresponding anchor`,
    );

  return anchor;
}

export function createConstraint(
  props: IntrinsicElementProps['constraint'],
): unknown {
  console.log('createConstraint:', inspect(props));
  let {let: description} = props;
  let anchor = descriptionToAnchor(description);

  let constraint;

  const methodNames: {[K in ConstraintRelation]: [string, string]} = {
    eq: ['constraintEqualToConstant', 'constraintEqualToAnchor'],
    lte: [
      'constraintLessThanOrEqualToConstant',
      'constraintLessThanOrEqualToAnchor',
    ],
    gte: [
      'constraintGreaterThanOrEqualToConstant',
      'constraintGreaterThanOrEqualToAnchor',
    ],
  };

  // FIXME: dawg
  let ohGodIAmSorry = (relation: ConstraintRelation) => {
    if (relation in props) {
      let target = (props as any)[relation];
      let method =
        typeof target === 'number'
          ? methodNames[relation][0]
          : methodNames[relation][1];
      constraint = (anchor as any)[method](
        typeof target === 'number' ? target : descriptionToAnchor(target),
      );
    }
  };

  ohGodIAmSorry('eq'); ohGodIAmSorry('lte'); ohGodIAmSorry('gte');

  if (!constraint)
    throw new Error(`createConstraint: failed to create constraint`);

  return constraint;
}
