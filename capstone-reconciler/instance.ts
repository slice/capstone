import {PropsWithChildren} from 'react';

export type InstanceProps = {
  window: PropsWithChildren<{
    title?: string;
    movableByWindowBackground?: boolean;
  }>;
};

export type TextInstance = {
  is: 'text';
  view: unknown;
};

export type Instance =
  | {
      is: 'window';
      backing: unknown;
      // TODO: restrict this type
      view: Instance;
    }
  | TextInstance;
