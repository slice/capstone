// needed for augmentation to work
import 'react';

import {InstanceProps} from 'capstone-reconciler/instance';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      window: InstanceProps['window'];
    }
  }
}
