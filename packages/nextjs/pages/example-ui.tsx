import Head from "next/head";
import type { NextPage } from "next";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { ContractData } from "~~/components/example-ui/ContractData";
import { ContractInteraction } from "~~/components/example-ui/ContractInteraction";

const ExampleUI: NextPage = () => {
  return (
    <>
      <Head>
        <title>Scaffold-eth Example Ui</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
          <ContractInteraction />
          <ContractData />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ExampleUI;
