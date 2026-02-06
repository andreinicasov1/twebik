import { AxiosProvider } from './axios/axios-context';
import { AuthProvider } from './auth/context/auth-context';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <AxiosProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </AxiosProvider>
  );
}
