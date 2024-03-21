import React from 'react';

import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  StatusBar,
} from 'react-native';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import AuthStack from './src/stack/AuthStack';

const App = () => {
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    version: 3,
    colors: {
      ...DefaultTheme.colors,
      primary: 'green',
    },
  };

  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="green" />
        <AuthStack />
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
