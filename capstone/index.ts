import {create} from '../capstone-reconciler';

export function run(tree: React.ReactNode) {
  create(tree);
  $.NSRunLoop.currentRunLoop.run;
}
