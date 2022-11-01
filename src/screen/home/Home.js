import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Home = ({userData, navigation}) => {
  const [user, setUser] = useState([]);
  const getUser = async () => {
    try {
      const querySnap = await firestore()
        .collection('users')
        .where('uid', '!=', userData.uid)
        .get();

      const allUsers = querySnap.docs.map(docSnap => docSnap.data());
      setUser(allUsers);
    } catch (error) {
      console.log('error:', error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  const Card = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate('Chat', {name: item.name, uid: item.uid})
        }>
        <View style={styles.container}>
          <Image source={{uri: item.pic}} style={styles.image} />
          <View>
            <Text style={styles.txt}>{item.name}</Text>
            <Text>{item.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList
        data={user}
        keyExtractor={item => item.uid}
        renderItem={({item}) => <Card item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'green',
    marginRight: 8,
  },
  txt: {
    fontSize: 18,
    color: '#000',
  },
  container: {
    flexDirection: 'row',
    margin: 5,
    padding: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});
export default Home;
