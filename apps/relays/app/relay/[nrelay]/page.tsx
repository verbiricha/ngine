import dynamic from "next/dynamic";

import Layout from "../../components/layout";
const Relay = dynamic(() => import("../../components/relay"), {
  ssr: false,
});

export default function RelayPage({ params }: { params: { nrelay: string } }) {
  return (
    <Layout>
      <Relay nrelay={params.nrelay} />
    </Layout>
  );
}
