// import firebase from 'react-native-firebase';
// Optional flow type
// import type { RemoteMessage } from 'react-native-firebase';
// import { AsyncStorage } from 'react-native'
// import firebase from 'react-native-firebase'
import dataExtractor from './dataExtractor'

export default async (message) => {
  // handle your message

  await dataExtractor(message, 'bgHandler')
  return Promise.resolve()
}

// export const backgroundNotificationHandler = async (message) => {
//   const channel = new firebase.notifications.Android.Channel('notification-channel', 'Notification Channel', firebase.notifications.Android.Importance.Max)
//     .setDescription('Notification channel')
//
//   // Create the channel
//   firebase.notifications().android.createChannel(channel)
//   const notification = new firebase.notifications.Notification()
//     .setNotificationId('notificationId')
//     .setTitle('Test')
//     .setBody('Body')
//
//   notification.android.setChannelId('notification-channel')
//   notification.android.setAutoCancel(true)
//
//   firebase.notifications().displayNotification(notification)
//
//   await fetch('https://us-central1-reactnativeignite.cloudfunctions.net/notify/ack')
//   await AsyncStorage.setItem('payload', JSON.stringify(message.data))
//   return Promise.resolve()
// }
