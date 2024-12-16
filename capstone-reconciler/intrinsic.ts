import {createConstraint} from './constraints';
import {Instance, InstanceProps} from './instance';

type IntrinsicElements = {
  [IntrinsicName in keyof Omit<InstanceProps, 'text'>]: (
    props: InstanceProps[IntrinsicName],
  ) => Instance;
};

const IntrinsicElements = {
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

export default IntrinsicElements;
