import { formatRelativeTime } from "../format";

interface FormattedRelativeTimeProps {
  timestamp: number;
}

// todo: short version
export default function FormattedRelativeTime({
  timestamp,
}: FormattedRelativeTimeProps) {
  return <>{formatRelativeTime(timestamp)}</>;
}
