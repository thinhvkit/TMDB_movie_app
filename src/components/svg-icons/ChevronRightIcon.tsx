import * as React from 'react';
import Svg, {Path, Styles} from 'react-native-svg';

export default function ChevronRightIcon(props: Styles) {
  return (
    <Svg width={10} height={14} fill="none" {...props}>
      <Path
        fill="#000"
        d="m9.096 7.355-6.556 6.38a.326.326 0 0 1-.455 0L.27 11.966a.308.308 0 0 1 0-.442l4.74-4.612L.268 2.3a.308.308 0 0 1 0-.442L2.085.092a.326.326 0 0 1 .455 0L9.096 6.47a.624.624 0 0 1 .189.442.61.61 0 0 1-.189.442Z"
      />
    </Svg>
  );
}
