import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import SignUp from '../screen/signUp/SignUp';
import Login from '../screen/login/Login';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import Home from '../screen/home/Home';
const Stack = createNativeStackNavigator();
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ChatScreen from '../screen/chatScreen/ChatScreen';
const AuthStack = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        setUser(userExist);
      } else setUser(null);
    });
    return () => {
      unregister();
    };
  }, []);
  const onLogoutHandler = async () => {
    const response = await auth().signOut();
    if (response) {
      alert('User is Successfully SignOut');
      setUser(null);
    } else {
      alert('Something Went Wrong');
    }
  };
  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            options={{
              headerRight: () => (
                <MaterialIcon
                  name="account-circle"
                  size={35}
                  color="green"
                  onPress={onLogoutHandler}
                />
              ),
              title: 'Whatsapp Clone',
            }}>
            {props => <Home {...props} userData={user} />}
          </Stack.Screen>
          <Stack.Screen
            name="Chat"
            options={({route}) => ({
              title: route.params.name,
            })}>
            {props => <ChatScreen {...props} userData={user} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default AuthStack;
