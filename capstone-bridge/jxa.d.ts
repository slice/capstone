declare global {
  const console: {log: (...values: any[]) => void};

  // TODO: this is missing a lot of stuff
  const ObjC: {
    import(framework: string): void;
  };

  // TODO: this is missing a lot of stuff
  const $: {
    (...args: any[]): any;
    [klass: string]: any;
  };
}

// make this file a module
export {};
