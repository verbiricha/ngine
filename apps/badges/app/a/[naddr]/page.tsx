"use client";

import { Flex } from "@chakra-ui/react";
import Layout from "@ui/layout";
import Address from "@ui/address";

export default function BadgePage({ params }: { params: { naddr: string } }) {
  return (
    <Layout>
      <Flex align="center" justify="center">
        <Address naddr={params.naddr} />
      </Flex>
    </Layout>
  );
}
