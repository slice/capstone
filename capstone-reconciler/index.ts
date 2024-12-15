// ES2020 module evaluation order is guaranteed when modules don't use
// top-level `await`, but i'd rather not rely on that ¯\_(ツ)_/¯
import './polyfills';
export {create, default} from './reconciler';
