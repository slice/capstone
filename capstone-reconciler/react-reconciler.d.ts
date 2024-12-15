declare module 'react-reconciler' {
  export type EventPriority = number /* opaque */;

  export interface HostConfig<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout,
  > {
    // https://github.com/facebook/react/pull/28751/files#diff-e8f6e99dfc7b12c75d5c2e0540dbbd7c3669f41daa54e12623c33bba55167a58R344
    resolveUpdatePriority(): EventPriority;
    getCurrentUpdatePriority(): EventPriority;
    setCurrentUpdatePriority(newPriority: EventPriority): void;
  }
}

export {};
