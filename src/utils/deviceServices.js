import React from 'react'
import { AsyncStorage, NetInfo } from 'react-native'

export const StorageClear = async () => {
    try {
        await AsyncStorage.clear()
    } catch(error) {
        console.log('AsyncStorage Clear Error: ' + error)
        throw error
    }
}

export const StorageGetItem = async (key) => {
    let value = ''
    try {
        value = await AsyncStorage.getItem(key) || 'none'
    } catch(error) {
        console.log('AsyncStorage Get Error: ' + error)
        throw error
    }
    return value
}

export const StorageSaveItem  = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch(error) {
        console.log('AsyncStorage Save Error: ' + error)
        throw error
    }
}
    
export const StorageSaveMultiItems = async (arr) => {
    try {
        await AsyncStorage.multiSet(arr)
    } catch(error) {
        console.log('AsyncStorage MultiSave Error: ' + error)
        throw error
    }
}
