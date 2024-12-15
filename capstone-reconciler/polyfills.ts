ObjC.import('dispatch');

const DISPATCH_TIME_NOW = 0; /*ull*/

// cribbed from https://gist.github.com/umireon/d1d449be666053b005e48db48aad6c46
function foundationTimer(
  callback: () => void,
  ms: number = 0,
  repeats: boolean = false,
) {
  let operation = $.NSBlockOperation.blockOperationWithBlock(callback);
  let timer = $.NSTimer.timerWithTimeIntervalTargetSelectorUserInfoRepeats(
    ms / 1000,
    operation,
    'main',
    null,
    repeats,
  );
  $.NSRunLoop.currentRunLoop.addTimerForMode(timer, 'timer');
  console.log('[:D] created timer', timer);
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
