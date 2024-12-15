export type InstanceProps = {
  window: {title?: string; movableByWindowBackground?: boolean};
  text: {children: string};
};

export type Instance =
  | {
      is: 'window';
      props: InstanceProps['window'];
      backing: unknown;
    }
  | {
      is: 'text';
      props: InstanceProps['text'];
    };
