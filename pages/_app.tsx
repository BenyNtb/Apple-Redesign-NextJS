import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { appWithTranslation } from "next-i18next";
import {FC} from "react"

type MyAppProps = {
  session: Session;
};

function MyApp({ Component, pageProps }: AppProps<MyAppProps>) {
  return (
    // Higher order component
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <Toaster />
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp as FC);
