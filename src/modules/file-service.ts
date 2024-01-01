import * as SecureStore from 'expo-secure-store';

export async function storeTestData() {
    const key = 'sampleData';

    const data = { firstName: 'Apolo', lastName: 'Garcia-Herrera Gregorio 2024' };
    await SecureStore.setItemAsync(key, JSON.stringify(data));
    alert(`data stored to key ${key}`);
}

export async function getValueFor(key: string) {
    const data = await SecureStore.getItemAsync(key);
    if (data) {
      alert(`Data found under key ${key}:\n${data}`)
    } else {
      alert(`No data found for key ${key}`);
    }
}

export async function deleteValue(key: string) {
    await SecureStore.deleteItemAsync(key);
    alert(`Deleted data under key ${key}`)
}