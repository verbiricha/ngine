"use client";

import { Flex } from "@chakra-ui/react";
import Layout from "@ui/layout";
import Edit from "@ui/edit";

export default function EditBadgePage({
  params,
}: {
  params: { naddr: string };
}) {
  return (
    <Layout>
      <Flex align="center" justify="center">
        <Edit naddr={params.naddr} />
      </Flex>
    </Layout>
  );
}
