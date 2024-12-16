import ReactReconciler, {
  HostConfigLikeActually,
  OpaqueRoot,
} from 'react-reconciler';
import {ConcurrentRoot, DefaultEventPriority} from 'react-reconciler/constants';
import {inspect} from 'capstone-bridge/introspection';

import {
  intrinsicElementConstructors,
  Instance,
  IntrinsicElementProps,
  TextInstance,
} from './intrinsic';
import {createConstraint} from './constraints';

function typeToIntrinsic(type: string): type is keyof IntrinsicElementProps {
  return Object.hasOwn(intrinsicElementConstructors, type);
}

// @ts-expect-error implement as you go
let hostConfig: HostConfigLikeActually<
  /* Type */ string,
  /* Props */ Record<string, any>,
  /* Container */ unknown,
  Instance,
  /* TextInstance */ TextInstance,
  /* SuspenseInstance */ never,
  /* HydratableInstance */ unknown,
  /* PublicInstance */ unknown,
  /* HostContext */ unknown,
  /* UpdatePayload */ Record<string, any>,
  unknown,
  unknown,
  unknown
> = {
  isPrimaryRenderer: true,
  getRootHostContext() {},
  resolveUpdatePriority() {
    return DefaultEventPriority;
  },
  getCurrentEventPriority() {
    return DefaultEventPriority;
  },
  getCurrentUpdatePriority() {
    return 0; /* NoEventPriority */
  },
  setCurrentUpdatePriority(_: unknown) {},
  prepareForCommit(_container) {
    return null;
  },
  clearContainer(_container) {},
  resetAfterCommit(_container) {},
  createInstance(type, props, _rootContainer, _hostContext, _internalHandle) {
    if (!typeToIntrinsic(type)) {
      throw new Error(`Capstone: unknown intrinsic element: ${type}`);
    }

    return intrinsicElementConstructors[type](props as any);
  },
  createTextInstance(text, _rootContainer, _hostContext, _internalHandle) {
    return {is: 'text', content: text, backingLabel: null};
  },
  shouldSetTextContent(_type, _props) {
    return false;
  },
  finalizeInitialChildren(
    _instance,
    _type,
    _props,
    _rootContainer,
    _hostContext,
  ) {
    return true;
  },
  appendChildToContainer(_container, _child) {},
  appendInitialChild(parentInstance, child) {
    console.log('appendInitialChild:', inspect(parentInstance), inspect(child));
    if (child.is === 'constraint') return;

    function individualChildView() {
      if ('backing' in child) return child.backing;
      return (child.backingLabel ??= intrinsicElementConstructors.label({
        children: child.content,
      }));
    }

    switch (parentInstance.is) {
      case 'window':
        (parentInstance.backing as any).contentView = individualChildView();
        break;
      case 'view':
        (parentInstance.backing as any).addSubview(individualChildView());
    }
  },
  maySuspendCommit(_type, _props) {
    return false;
  },
  commitMount(instance, _type, _props, _internalInstanceHandle) {
    console.log('commitMount:', inspect(instance));
    if (instance.is === 'window') {
      // @ts-expect-error
      instance.backing.makeKeyAndOrderFront($());
    }

    if (instance.is === 'constraint') {
      if (!instance.backing) {
        console.log(
          '[Constraints] deferred creation:',
          inspect(instance.props),
        );
        instance.backing = createConstraint(instance.props);
      }
      (instance.backing as any).active = true;
    }
  },
  commitTextUpdate(textInstance, _oldText, newText) {
    textInstance.content = newText;
    if (textInstance.backingLabel)
      (textInstance.backingLabel as any).stringValue = newText;
  },
  detachDeletedInstance(_node) {},
  getChildHostContext(parentHostContext, _type, _rootContainer) {
    return parentHostContext;
  },
  getPublicInstance(instance) {
    // TODO: maybe don't expose
    return instance;
  },
  removeChildFromContainer(_container, child) {
    if (child.is === 'window') {
      // @ts-expect-error
      child.backing.close;
    }
  },
  commitUpdate(instance, type, prevProps, newProps, _internalHandle) {
    console.log(
      'commitUpdate:',
      inspect(instance),
      type,
      inspect(prevProps),
      inspect(newProps),
    );

    if (instance.is === 'button') {
      (instance.backing as any).title = newProps.children;
    }
  },
  supportsMutation: true,
};

let Reconciler = ReactReconciler(hostConfig as any);

export default Reconciler;

let root: OpaqueRoot;

export function create(element: React.ReactNode) {
  root ??= Reconciler.createContainer(
    /* container */ {},
    /* tag */ ConcurrentRoot,
    /* hydrationCallbacks */ null,
    /* isStrictMode */ false,
    /* concurrentUpdatesByDefaultOverride */ false,
    /* identifierPrefix */ '',
    /* onRecoverableError */ (error) =>
      console.log('Capstone Recoverable Error:', error),
    /* transitionCallbacks */ null,
  );
  Reconciler.updateContainer(element, root);
  return root;
}
