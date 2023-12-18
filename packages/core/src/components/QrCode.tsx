import { QRCodeSVG } from "qrcode.react";

export interface QrCodeProps {
  data: string;
}

export default function QrCode({ data }: QrCodeProps) {
  return <QRCodeSVG value={data} size={256} marginSize={8} />;
}
