import { Tooltip, Image, ImageProps } from "@chakra-ui/react";

interface EmojiProps extends ImageProps {
  alt: string;
}

export default function Emoji({ alt, boxSize = 4, ...props }: EmojiProps) {
  return (
    <Tooltip label={alt}>
      <Image alt={alt} boxSize={boxSize} display="inline" mb={-1} {...props} />
    </Tooltip>
  );
}
