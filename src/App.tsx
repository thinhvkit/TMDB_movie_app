import React from 'react';
import {StatusBar} from 'react-native';

import {AppProvider} from './contexts/AppContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <AppNavigator />
    </AppProvider>
  );
}
