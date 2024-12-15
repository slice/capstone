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
  getRootHostContext: () => {},
  resolveUpdatePriority: () => DefaultEventPriority,
  getCurrentEventPriority: () => DefaultEventPriority,
  getCurrentUpdatePriority: () => 0 /* NoEventPriority */,
  setCurrentUpdatePriority: (_: unknown) => {},
  prepareForCommit: (container) => null,
  clearContainer: (container) => {},
  resetAfterCommit: (container) => {},
  createTextInstance: (text, rootContainer, hostContext, internalHandle) => {},
  appendChildToContainer: (container, child) => {},
  supportsMutation: true,
};

let Reconciler = ReactReconciler(hostConfig);

export default Reconciler;

let root: OpaqueRoot;

export function create(element: React.ReactNode) {
  root ??= Reconciler.createContainer(
    element,
    ConcurrentRoot,
    /* hydrationCallbacks */ null,
    /* isStrictMode */ false,
    /* concurrentUpdatesByDefaultOverride */ false,
    /* identifierPrefix */ '',
    /* onRecoverableError */ (error) =>
      console.error('Capstone Recoverable Error:', error),
    /* transitionCallbacks */ null,
  );
  Reconciler.updateContainer(element, root);
  return root;
}
