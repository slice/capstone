import ReactReconciler, {OpaqueRoot} from 'react-reconciler';
import {ConcurrentRoot, DefaultEventPriority} from 'react-reconciler/constants';

import IntrinsicElements from './intrinsic';
import {Instance, TextInstance} from './instance';
import {createConstraint} from './constraints';

function typeToIntrinsic(type: string): type is keyof IntrinsicElements {
  return Object.hasOwn(IntrinsicElements, type);
}

function inspect(thing: any): string {
  if (Number.isNaN(thing)) {
    return 'NaN';
  } else if (thing === null) {
    return '[null]';
  }

  switch (typeof thing) {
    case 'object':
      let output = '';
      if ('is' in thing) {
        // TODO: use symbol instead
        output += `<${thing.is} `;
      } else {
        output += '{';
      }

      for (let key in thing) {
        if (key === 'is') continue;
        output += inspect(key) + ': ' + inspect(thing[key]);
        output += ', ';
      }

      output += 'is' in thing ? '>' : '}';
      return output;
    case 'string':
      return '"' + thing + '"';
    case 'number':
    case 'bigint':
      return String(thing);
    case 'boolean':
      return String(thing);
    case 'function':
      return '[function]';
    case 'undefined':
      return '[undefined]';
    case 'symbol':
      return '[symbol]';
  }
}

// @ts-expect-error implement as you go
let hostConfig: ReactReconciler.HostConfig<
  /* Type */ string,
  /* Props */ Record<string, any>,
  /* Container */ unknown,
  Instance,
  /* TextInstance */ TextInstance,
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
    if (!typeToIntrinsic(type)) {
      throw new Error(`Capstone: unknown intrinsic element: ${type}`);
    }

    return IntrinsicElements[type](props as any);
  },
  createTextInstance(text, _rootContainer, _hostContext, _internalHandle) {
    return {is: 'text', content: text};
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
    console.log(':3', inspect(parentInstance), inspect(child));
    if (child.is === 'constraint') return;
    let childView = () =>
      child.is === 'text'
        ? IntrinsicElements.label({children: child.content})
        : child.backing;
    switch (parentInstance.is) {
      case 'window':
        (parentInstance.backing as any).contentView = childView();
        break;
      case 'view':
        (parentInstance.backing as any).addSubview(childView());
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
    // @ts-expect-error
    textInstance.view.stringValue = newText;
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
