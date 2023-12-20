import NextLink from "next/link";
import { Link as BaseLink, LinkProps } from "@chakra-ui/react";

export default function Link(props: LinkProps) {
  return <BaseLink as={NextLink} {...props} />;
}
