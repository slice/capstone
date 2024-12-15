const kCFRunLoopDefaultMode = 'kCFRunLoopDefaultMode';

// cribbed from https://gist.github.com/umireon/d1d449be666053b005e48db48aad6c46
function foundationTimer(
  callback: () => void,
  ms: number,
  repeats: boolean = false,
) {
  let operation = $.NSBlockOperation.blockOperationWithBlock(callback);
  // FIXME: creating a timer with 0 delay doesn't really work, but we should be
  // using performBlock: for that anyways probably.
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

globalThis.setTimeout = function funnySetTimeout(
  callback,
  ms,
): CapstoneDispatchTimer {
  return foundationTimer(callback.bind(callback), ms, false);
};

globalThis.setInterval = function funnySetTimeout(
  callback,
  ms,
): CapstoneDispatchTimer {
  return foundationTimer(callback.bind(callback), ms, true);
};

function invalidate(timer: CapstoneDispatchTimer) {
  // TODO: does this need $(…)? why?
  // @ts-expect-error
  $(timer.invalidate);
}

globalThis.clearTimeout = invalidate;
globalThis.clearInterval = invalidate;
