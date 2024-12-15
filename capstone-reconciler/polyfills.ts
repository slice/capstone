const kCFRunLoopDefaultMode = 'kCFRunLoopDefaultMode';

// cribbed from https://gist.github.com/umireon/d1d449be666053b005e48db48aad6c46
function foundationTimer(
  callback: () => void,
  ms: number,
  repeats: boolean = false,
) {
  let operation = $.NSBlockOperation.blockOperationWithBlock(callback);
  const effectiveDelaySeconds = Math.max(1, ms) / 1000;
  let timer = $.NSTimer.timerWithTimeIntervalTargetSelectorUserInfoRepeats(
    effectiveDelaySeconds,
    operation,
    'main',
    null,
    repeats,
  );
  $.NSRunLoop.currentRunLoop.addTimerForMode(timer, kCFRunLoopDefaultMode);
  return timer;
}

globalThis.setTimeout = function funnySetTimeout(callback, ms, ...args) {
  return foundationTimer(callback.bind(callback, ...args), ms, false);
};

globalThis.setInterval = function funnySetTimeout(callback, ms, ...args) {
  return foundationTimer(callback.bind(callback, ...args), ms, true);
};

function invalidate(timer) {
  $(timer.invalidate);
}

globalThis.clearTimeout = invalidate;
globalThis.clearInterval = invalidate;
