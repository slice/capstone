import {PropsWithChildren} from 'react';

import {
  ConstraintDescriptor,
  ConstraintRightSide,
  createConstraint,
} from './constraints';

export type IntrinsicElementProps = {
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
      props: IntrinsicElementProps['constraint'];
    };

/** { <intrinsic_name>: (props: IntrinsicElementProps[<intrinsic_name>]) => Instance */
type IntrinsicElements = {
  [IntrinsicName in keyof IntrinsicElementProps]: (
    props: IntrinsicElementProps[IntrinsicName],
  ) => Instance;
};

export const intrinsicElementConstructors = {
  window(props) {
    let window = $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer(
      $.NSMakeRect(0, 0, 400, 400),
      $.NSTitledWindowMask |
        $.NSWindowStyleMaskClosable |
        $.NSWindowStyleMaskMiniaturizable,
      $.NSBackingStoreBuffered,
      false,
    );

    window.opaque = true;
    window.title = props.title ?? 'Capstone Window';
    window.movableByWindowBackground = props.movableByWindowBackground ?? false;

    return {is: 'window', backing: window, view: $()};
  },
  label(props) {
    return {
      is: 'label',
      backing: $.NSTextField.labelWithString(props.children),
    };
  },
  view(_props) {
    return {
      is: 'view',
      backing: $.NSView.alloc.initWithFrame($.NSMakeRect(0, 0, 0, 0)),
    };
  },
  constraint(props) {
    if (!props.let.ref.current) {
      // native view not available when constraint element is created, we'll
      // defer to when it mounts
      return {is: 'constraint', backing: null, props};
    }

    return {is: 'constraint', backing: createConstraint(props), props};
  },
} as const satisfies IntrinsicElements;
