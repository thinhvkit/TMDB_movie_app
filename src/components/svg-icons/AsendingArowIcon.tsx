import * as React from 'react';
import Svg, {Path, Styles} from 'react-native-svg';

export default function AscendingArrowIcon(props: Styles) {
  return (
    <Svg width={10} height={15} fill="none" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="m5.889.296 3.733 3.221c.499.43.499 1.113 0 1.544-.499.409-1.315.409-1.788 0L6.232 3.72V13.91c0 .57-.555 1.087-1.235 1.087s-1.26-.522-1.26-1.087V3.722L2.162 5.06c-.499.409-1.29.409-1.788 0-.237-.226-.368-.478-.368-.748 0-.296.13-.565.368-.796L4.1.296A.893.893 0 0 1 4.524.07C4.68.026 4.81 0 4.997 0c.343 0 .655.091.892.296Z"
        clipRule="evenodd"
      />
    </Svg>
  );
}
