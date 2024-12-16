import {PropsWithChildren} from 'react';
import {ConstraintDescriptor, ConstraintRightSide} from './constraints';

export type InstanceProps = {
  window: PropsWithChildren<{
    title?: string;
    movableByWindowBackground?: boolean;
  }>;
  label: {children: string};
  view: {children: React.ReactNode};
  constraint: {let: ConstraintDescriptor} & ConstraintRightSide;
};

export type TextInstance = {
  is: 'text';
  content: string;
};

export type Instance =
  | {
      is: 'window';
      backing: unknown;
      // TODO: restrict this type
      view: Instance;
    }
  | {
      is: 'label';
      backing: unknown;
    }
  | {
      is: 'view';
      backing: unknown;
    }
  | {
      is: 'constraint';
      backing: unknown;
      props: InstanceProps['constraint'];
    };
