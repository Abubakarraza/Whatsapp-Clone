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
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker, {types} from 'react-native-document-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const SignUp = ({navigation}) => {
  const [email, setemail] = useState('');
  const [name, setname] = useState('');
  const [password, setpassword] = useState('');
  const [image, setimage] = useState(null);
  const [next, setnext] = useState(false);
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
  const userSignUp = async () => {
    if (!name || !email || !image || !password) {
      alert('Please Fill all Field');
      return;
    }

    try {
      setloading(true);
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      if (result) {
        await firestore().collection('users').doc(result.user.uid).set({
          name: name,
          email: result.user.email,
          uid: result.user.uid,
          pic: image,
        });
      }
      setloading(false);
      alert('user is Successfully Created');
    } catch (error) {
      if (error) {
        alert('Something Went Wrong Please Try Again Later');
        console.log('error:', error);
      }
    }
  };
  const onUploadImageHandler = async () => {
    await launchImageLibrary({quality: 0.5}, fileObj => {
      console.log(fileObj);
      const uploadTask = storage()
        .ref()
        .child(`/userprofile/${Date.now()}`)
        .putFile(fileObj.uri);

      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100) alert('image uploaded');
        },
        error => {
          alert('error uploading image');
        },

        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            setimage(downloadURL);
            console.log('downloadURL:', downloadURL);
          });
        },
      );
    });
  };

  return (
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.text}>Welcome To Whatsapp Clone</Text>
        <Image style={styles.img} source={require('../../assests/wh.jpg')} />
      </View>
      <View style={styles.secondContainer}>
        {!next ? (
          <>
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
                if (!email || !password) {
                  return alert('Please Type all Field');
                } else {
                  setnext(true);
                }
              }}>
              <Text style={{color: 'white', fontSize: 16}}>Next</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              label="Name"
              value={name}
              onChangeText={name => setname(name)}
              mode="outlined"
            />
            <TouchableOpacity
              style={styles.btn}
              onPress={() => onUploadImageHandler()}>
              <Text style={{color: 'white', fontSize: 16}}>
                Upload Profile Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => userSignUp()}
              disabled={image ? false : true}
              style={styles.btn}>
              <Text style={{color: 'white', fontSize: 16}}>SignUp</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.text2}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{color: 'green'}}>Login</Text>
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

export default SignUp;
