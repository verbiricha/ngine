"use client";

import Layout from "../../components/layout";
import Relay from "../../components/relay";

export default function RelayPage({ params }: { params: { nrelay: string } }) {
  return (
    <Layout>
      <Relay nrelay={params.nrelay} />
    </Layout>
  );
}
