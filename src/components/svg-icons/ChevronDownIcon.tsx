import * as React from 'react';
import Svg, {Path, Styles} from 'react-native-svg';

export default function ChevronDownIcon(props: Styles) {
  return (
    <Svg width={14} height={10} fill="none" {...props}>
      <Path
        fill="#000"
        d="M6.36 9.386.148 2.67a.343.343 0 0 1-.089-.233c0-.087.032-.17.09-.233l1.72-1.86a.293.293 0 0 1 .216-.097c.08 0 .158.035.215.097l4.49 4.854L11.28.344a.293.293 0 0 1 .215-.097c.08 0 .158.035.215.097l1.721 1.86c.057.062.09.146.09.233 0 .087-.033.17-.09.233l-6.21 6.716a.608.608 0 0 1-.198.143.569.569 0 0 1-.663-.143Z"
      />
    </Svg>
  );
}
