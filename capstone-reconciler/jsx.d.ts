// needed for augmentation to work
import 'react';

import {InstanceProps} from './instance';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      window: InstanceProps['window'];
    }
  }
}
