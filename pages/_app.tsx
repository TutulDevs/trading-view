import "../styles/app.sass";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../src/store/index";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
