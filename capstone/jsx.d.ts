// needed for augmentation to work
import 'react';

import {IntrinsicElementProps} from 'capstone-reconciler/intrinsic';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      window: IntrinsicElementProps['window'];
      // @ts-expect-error conflict
      view: IntrinsicElementProps['view'];
      constraint: IntrinsicElementProps['constraint'];
      // @ts-expect-error conflict
      label: IntrinsicElementProps['label'];
    }
  }
}
