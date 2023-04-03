import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { SnackbarProvider } from "notistack";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";
import { DialogProvider } from "~~/context/dialog";
import { useEthPrice } from "~~/hooks/scaffold-eth";
import { useAppStore } from "~~/services/store/store";
import { wagmiClient } from "~~/services/web3/wagmiClient";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";
import { theme } from "~~/theme";

export default function App({ Component, pageProps }: AppProps) {
  const price = useEthPrice();
  const setEthPrice = useAppStore(state => state.setEthPrice);
  const [pageLoaded, setPageLoaded] = useState(false);

  /**
   * Fix for hydration error (docs - https://github.com/vercel/next.js/discussions/35773#discussioncomment-3484225)
   */
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    if (price > 0) {
      setEthPrice(price);
    }
  }, [setEthPrice, price]);

  return (
    <WagmiConfig client={wagmiClient}>
      <NextNProgress />
      <RainbowKitProvider chains={appChains.chains}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <DialogProvider>
              <NextNProgress height={4} color={theme.palette.primary.main} />
              {pageLoaded && <Component {...pageProps} />}
            </DialogProvider>
          </SnackbarProvider>
        </ThemeProvider>
        <Toaster />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
