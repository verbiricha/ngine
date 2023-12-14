import type { IconProps } from "./props";

export function Link(props: IconProps) {
  return (
    <svg
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.47154 12.4926L7.52874 13.4354C6.22699 14.7372 4.11644 14.7372 2.81469 13.4354C1.51294 12.1337 1.51294 10.0231 2.81469 8.72138L3.7575 7.77857M12.2428 8.72138L13.1856 7.77857C14.4873 6.47682 14.4873 4.36627 13.1856 3.06453C11.8838 1.76278 9.77329 1.76278 8.47154 3.06453L7.52874 4.00734M5.66681 10.5833L10.3335 5.91663"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
