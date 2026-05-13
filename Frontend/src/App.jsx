import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar is intentionally removed from here.
          It will only render on authenticated routes (post-login).
          The landing page has its own minimal header. */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
