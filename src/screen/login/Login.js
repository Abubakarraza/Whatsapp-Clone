import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setloading] = useState(false);
  if (loading) {
    return (
      <ActivityIndicator
        style={styles.indicator}
        size={'large'}
        color="green"
      />
    );
  }
  const onLoginHandler = async () => {
    if (!email || !password) {
      return alert('Please Type all Field');
    }
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      if (result.user) {
        alert('User is Successfully Sign In');
      } else {
        alert('invalid Credentials');
      }
      setloading(false);
    } catch (error) {
      alert('Something Went Wrong');
      console.log('error:', error);
    }
  };
  return (
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.text}>Welcome To Whatsapp Clone</Text>
        <Image style={styles.img} source={require('../../assests/wh.jpg')} />
      </View>
      <View style={styles.secondContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={email => setemail(email)}
          mode="outlined"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={email => setpassword(email)}
          mode="outlined"
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            onLoginHandler();
          }}>
          <Text style={{color: 'white', fontSize: 16}}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.text2}>
        <Text>Don't have an Account ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{color: 'green'}}>SignUp</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 22,
    color: 'green',
  },
  img: {
    width: 200,
    height: 200,
    marginTop: 12,
  },
  btn: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  secondContainer: {
    justifyContent: 'space-evenly',
    height: '40%',
  },
  text2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
