
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { NewsProvider } from '../context/NewsContext';

function MyApp({ Component, pageProps }) {
  return (
    <NewsProvider>
      <Component {...pageProps} />
    </NewsProvider>
  );
}

export default MyApp;
