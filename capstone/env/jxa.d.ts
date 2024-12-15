declare global {
  const console: {log: (...values: any[]) => void};

  const ObjC: {
    import(framework: string): void;
  };

  const $: {
    (...args: any[]): any;
    [klass: string]: any;
  };
}

// make this file a module
export {};
