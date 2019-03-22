import { AsyncStorage } from 'react-native'

export default async (message, from) => {
  if (from) {
    message.data['from'] = from
  }

  await AsyncStorage.setItem('payload', JSON.stringify(message.data))
  await fetch('https://us-central1-reactnativeignite.cloudfunctions.net/notify/ack')
}
