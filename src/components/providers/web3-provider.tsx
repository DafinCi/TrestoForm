"use client";

import { useState } from "react";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
// CARA TERBARU SUI SDK V2: Import dari jsonRpc, bukan dari client lagi
import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";

// Gunakan getJsonRpcFullnodeUrl sesuai standar dApp Kit untuk SDK >= 2.0.0
const { networkConfig } = createNetworkConfig({
  localnet: { url: getJsonRpcFullnodeUrl("localnet") },
  testnet: { url: getJsonRpcFullnodeUrl("testnet") },
  mainnet: { url: getJsonRpcFullnodeUrl("mainnet") },
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  // QueryClient state aman buat SSR Next.js App Router
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
