import './jsx';

declare global {
  type CapstoneDispatchTimer = {[__capstone$opaque$timer]: true};
  const __capstone$opaque$timer: unique symbol;

  // not exactly like HTML's, but close enough
  function setTimeout(
    delayed: () => void,
    afterMs: number,
  ): CapstoneDispatchTimer;
  function setInterval(
    delayed: () => void,
    afterMs: number,
  ): CapstoneDispatchTimer;
  function clearInterval(timer: CapstoneDispatchTimer): void;
  function clearTimeout(timer: CapstoneDispatchTimer): void;

  const console: {log: (...values: any[]) => void};

  const ObjC: {
    import(framework: string): void;
  };

  const $: {
    (...args: any[]): any;
    [klass: string]: any;
  };
}
