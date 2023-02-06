import Head from "next/head";
import dynamic from "next/dynamic";
import { Nav } from "components/nav/Nav.component";
import { Suggestions } from "components/suggestions/Suggestions.component";

const Chart = dynamic(() => import("components/chart/Chart.component"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Trading View Chart </title>
        <meta name="description" content="trading view chart" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <Suggestions />

      <Chart className="container" />
    </>
  );
}
