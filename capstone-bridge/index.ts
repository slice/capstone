export function operation(callback: () => void): {
  target: unknown;
  action: string; // selector
} {
  let operation = $.NSBlockOperation.blockOperationWithBlock(callback);
  return {target: operation, action: 'main'};
}
