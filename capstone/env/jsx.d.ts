// needed for augmentation to work
import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      window: {title: string};
    }
  }
}
