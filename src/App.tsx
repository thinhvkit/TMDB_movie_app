import React from 'react';
import {StatusBar} from 'react-native';

import {AppProvider} from './contexts/AppContext';
import AppNavigator from './navigation/AppNavigator';
import {COLORS} from './constants/colors';

export default function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <AppNavigator />
    </AppProvider>
  );
}
