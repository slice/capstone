import {Instance, InstanceProps} from './instance';

export type ConstraintDimensions = 'width' | 'height';

export type ConstraintRelation = {
  equal: number | ConstraintDescriptor;
};

// points to a dimension, and stashes a ref to the owning view
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

export function createConstraint(props: InstanceProps['constraint']): unknown {
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
