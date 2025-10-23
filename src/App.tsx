import React from 'react';
import {StatusBar} from 'react-native';
import {ApolloProvider} from '@apollo/client/react';

import {AppProvider} from './contexts/AppContext';
import AppNavigator from './navigation/AppNavigator';
import {COLORS} from './constants/colors';
import {graphqlClient} from './services/graphqlClient';

export default function App() {
  return (
    <ApolloProvider client={graphqlClient}>
      <AppProvider>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <AppNavigator />
      </AppProvider>
    </ApolloProvider>
  );
}
