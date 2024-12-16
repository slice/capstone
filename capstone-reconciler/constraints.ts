import {Instance, IntrinsicElementProps} from './intrinsic';

export const CONSTRAINT_DIMENSIONS = ['width', 'height'] as const;

export type ConstraintDimensions = (typeof CONSTRAINT_DIMENSIONS)[number];

export type ConstraintRightSide = {
  equal: number | ConstraintDescriptor;
};

/**
 * a descriptor specifies a certain dimension and stashes a ref-like object to
 * the relevant view
 */
export type ConstraintDescriptor = {
  [Dimension in ConstraintDimensions]: {
    attribute: Dimension;
  };
}[ConstraintDimensions] & {
  ref: {current: Instance | null};
};

function descriptionToAnchor(description: ConstraintDescriptor): unknown {
  let anchor;
  switch (description.attribute) {
    case 'width':
      anchor = (description.ref.current?.backing as any).widthAnchor;
      break;
    case 'height':
      anchor = (description.ref.current?.backing as any).heightAnchor;
      break;
  }
  if (!anchor)
    throw new Error(
      `Failed to resolve constraint descriptor ${description.attribute} to corresponding anchor`,
    );
  return anchor;
}

export function createConstraint(
  props: IntrinsicElementProps['constraint'],
): unknown {
  let {let: description} = props;
  let anchor = descriptionToAnchor(description);

  let constraint;
  if (typeof props.equal === 'number') {
    constraint = (anchor as any).constraintEqualToConstant(props.equal);
  } else {
    constraint = (anchor as any).constraintEqualToAnchor(
      descriptionToAnchor(props.equal),
      1,
    );
  }

  return constraint;
}
