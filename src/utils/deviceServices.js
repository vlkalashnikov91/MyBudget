import { AsyncStorage } from 'react-native'

export const Storage = {
    Clear: async () => {
        try {
            await AsyncStorage.clear()
        } catch(error) {
            console.log('AsyncStorage Clear Error: ' + error)
            throw error
        }
    },
    GetItem: async (key) => {
        let value = ''
        try {
            value = await AsyncStorage.getItem(key) || ''
        } catch(error) {
            console.log('AsyncStorage Get Error: ' + error)
            throw error
        }
        return value
    },
    SaveItem: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value)
        } catch(error) {
            console.log('AsyncStorage Save Error: ' + error)
            throw error
        }
    },
    RemoveItem: async (key) => {
        try {
            await AsyncStorage.removeItem(key)
        } catch(error) {
            console.log('AsyncStorage Remove Error: ' + error)
            throw error
        }
    }
}