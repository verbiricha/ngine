import QR from "react-qr-code";

export interface QrCodeProps {
  data: string;
}

export default function QrCode(props: QrCodeProps) {
  return (
    <QR
      size={256}
      value={props.data}
      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      viewBox={`0 0 256 256`}
    />
  );
}
