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
} as const satisfies IntrinsicElements;

export default IntrinsicElements;
