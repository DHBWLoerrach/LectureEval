import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import LoadingSpinner from '~/components/LoadingSpinner';
import Navigation from '~/components/Navigation';
import { useAuth } from '~/context/AuthContext';
import LoginView from '~/views/Login';
import NoConnection from '~/views/NoConnection';

const Main = () => {
  const { session, isLoading } = useAuth();

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    /**
     * Check whether or not the user has an internet connection.
     *
     * If the user is not connected to the internet, the NoConnection component will be displayed.
     */
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isInternetReachable === null) return;

      setIsConnected(state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) return <NoConnection />;

  if (isLoading) return <LoadingSpinner />;

  return session ? <Navigation /> : <LoginView />;
};
export default Main;
