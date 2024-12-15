import ReactReconciler, {OpaqueRoot} from 'react-reconciler';
import {ConcurrentRoot, DefaultEventPriority} from 'react-reconciler/constants';

import IntrinsicElements from './intrinsic';
import {Instance} from './instance';

let hostConfig: ReactReconciler.HostConfig<
  /* Type */ string,
  /* Props */ Record<string, any>,
  /* Container */ unknown,
  Instance,
  /* TextInstance */ {is: 'text'; props: {children: React.ReactNode}},
  /* SuspenseInstance */ never,
  unknown,
  unknown,
  unknown,
  unknown,
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
    if (!Object.prototype.hasOwnProperty.call(IntrinsicElements, type)) {
      throw new Error(`Capstone: unknown intrinsic element: ${type}`);
    }

    console.log('[Create]', type);
    return IntrinsicElements[type](props);
  },
  createTextInstance(_text, _rootContainer, _hostContext, _internalHandle) {},
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
    return false;
  },
  appendChildToContainer(_container, child) {
    if (child.is === 'window') {
      child.backing.makeKeyAndOrderFront($());
    }
  },
  maySuspendCommit(_type, _props) {
    return false;
  },
  detachDeletedInstance(_node) {},
  getChildHostContext(parentHostContext, _type, _rootContainer) {
    return parentHostContext;
  },
  removeChildFromContainer(_container, child) {
    if (child.is === 'window') {
      child.backing.close();
    }
  },
  commitUpdate(
    _instance,
    _updatePayload,
    _type,
    _prevProps,
    _nextProps,
    _internalHandle,
  ) {},
  supportsMutation: true,
};

let Reconciler = ReactReconciler(hostConfig);

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
