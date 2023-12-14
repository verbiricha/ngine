import type { IconProps } from "./props";

export function User(props: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.00023 10C5.88684 10 4.00742 11.0204 2.81089 12.604C2.55336 12.9448 2.4246 13.1152 2.42881 13.3455C2.43207 13.5235 2.5438 13.7479 2.6838 13.8578C2.86502 14 3.11614 14 3.61838 14H12.3821C12.8843 14 13.1354 14 13.3166 13.8578C13.4567 13.7479 13.5684 13.5235 13.5716 13.3455C13.5759 13.1152 13.4471 12.9448 13.1896 12.604C11.993 11.0204 10.1136 10 8.00023 10Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.00023 8C9.65708 8 11.0002 6.65685 11.0002 5C11.0002 3.34315 9.65708 2 8.00023 2C6.34337 2 5.00023 3.34315 5.00023 5C5.00023 6.65685 6.34337 8 8.00023 8Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
