import ReactReconciler, {OpaqueRoot} from 'react-reconciler';
import {ConcurrentRoot, DefaultEventPriority} from 'react-reconciler/constants';

let hostConfig: ReactReconciler.HostConfig<
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
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
  createInstance(type, props, rootContainer, hostContext, internalHandle) {
    console.log('** createInstance', {
      type,
      props,
      rootContainer,
      hostContext,
      internalHandle,
    });
    return {};
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
  appendChildToContainer(container, child) {
    console.log(
      '** appendChildToContainer! container:',
      container,
      'child:',
      child,
    );
  },
  maySuspendCommit(_type, _props) {
    return false;
  },
  detachDeletedInstance(_node) {},
  getChildHostContext(parentHostContext, _type, _rootContainer) {
    return parentHostContext;
  },
  removeChildFromContainer(_container, _child) {},
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
