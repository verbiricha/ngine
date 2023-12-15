// todo: make ssr friendly
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

const useQRCodeStyling = (
  options: QRCodeStylingOptions,
): QRCodeStyling | null => {
  if (typeof window !== "undefined") {
    const qrCodeStyling: QRCodeStyling = new QRCodeStyling(options);
    return qrCodeStyling;
  }
  return null;
};

export interface QrCodeProps {
  data?: string;
  link?: string;
  avatar?: string;
  height?: number;
  width?: number;
}

export default function QrCode(props: QrCodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const qr = useQRCodeStyling({
    width: props.width || 256,
    height: props.height || 256,
    data: props.data,
    margin: 5,
    type: "canvas",
    image: props.avatar,
    dotsOptions: {
      type: "rounded",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
    },
    imageOptions: {
      crossOrigin: "anonymous",
    },
  });

  useEffect(() => {
    if ((props.data?.length ?? 0) > 0 && ref.current && qr) {
      ref.current.innerHTML = "";
      qr.append(ref.current);
      if (props.link) {
        ref.current.onclick = function () {
          const elm = document.createElement("a");
          elm.href = props.link ?? "";
          elm.click();
        };
      }
    } else if (ref.current) {
      ref.current.innerHTML = "";
    }
  }, [props.data, ref, qr]);

  return <div ref={ref}></div>;
}
