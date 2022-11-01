import React, {useEffect, useState} from 'react';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import fireStore from '@react-native-firebase/firestore';
import {View, StyleSheet, Text} from 'react-native';

const ChatScreen = ({userData, route}) => {
  const [messages, setMessages] = useState([]);
  const {uid} = route.params;
  const onGetAllMessageHandler = async () => {
    const id =
      uid > userData.uid ? userData.uid + '-' + uid : uid + '-' + userData.uid;
    const querySnap = await fireStore()
      .collection('chatRooms')
      .doc(id)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();
    const allMsg = querySnap.docs.map(doc => {
      return {
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      };
    });
    setMessages(allMsg);
  };

  useEffect(() => {
    // onGetAllMessageHandler();

    const id =
      uid > userData.uid ? userData.uid + '-' + uid : uid + '-' + userData.uid;
    const messageRef = fireStore()
      .collection('chatRooms')
      .doc(id)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    messageRef.onSnapshot(querySnap => {
      const allMsg = querySnap.docs.map(doc => {
        const data = doc.data();
        if (data.createdAt) {
          return {
            ...doc.data(),
            createdAt: data.createdAt.toDate(),
          };
        } else {
          return {
            ...doc.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allMsg);
    });
  }, []);

  const onSend = async messages => {
    const myMsg = messages[0];
    const msg = {
      ...myMsg,
      sentBy: userData.uid,
      sentTo: uid,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, msg));
    const id =
      uid > userData.uid ? userData.uid + '-' + uid : uid + '-' + userData.uid;
    await fireStore()
      .collection('chatRooms')
      .doc(id)
      .collection('messages')
      .add({...msg, createdAt: fireStore.FieldValue.serverTimestamp()});
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userData.uid,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {backgroundColor: 'green'},
              }}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ChatScreen;
