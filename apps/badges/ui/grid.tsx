import type { ReactNode } from "react";
import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react";

interface GridProps extends SimpleGridProps {
  maxCol?: number;
}

export default function Grid({
  maxCol = 3,
  spacing = 3,
  children,
  ...props
}: GridProps) {
  return (
    <SimpleGrid
      columns={{
        base: 1,
        sm: 2,
        md: maxCol,
      }}
      px={{ base: 4, sm: 0 }}
      spacing={spacing}
      {...props}
    >
      {children}
    </SimpleGrid>
  );
}
