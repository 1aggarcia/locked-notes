# Overview

This is a simple notes app offering encrypted protection of notes via numerical PIN, designed for iOS and Android. I am still working out a good name, feel free to open up an issue with name suggestions.

By default the app is unlockable for 10 minutes at a time, during which the user can create, edit, and delete notes. All files are encrypted on the disk, and all changes are automatically saved.

<img src="https://raw.githubusercontent.com/1aggarcia/locked-notes/main/mock_data/demo_1.png" width="250"/> <img src="https://raw.githubusercontent.com/1aggarcia/locked-notes/main/mock_data/demo_2.png" width="250"/> <img src="https://raw.githubusercontent.com/1aggarcia/locked-notes/main/mock_data/demo_3.png" width="250"/>

## Demo APK

If you want to demo the app without downloading any source code, there is a relatively recent APK avaliable in the [builds](builds/) folder which you can install on an Android device. Instructions to build the app yourself are down

## Source Code

This app is built in TypeScript using the React Native framework and the Expo platform.

### Software Setup

Required tools:
- [Node.js](https://nodejs.org/en) - run `node -v` in the terminal to confirm installation.
- [Expo Go](https://expo.dev/client) for iOS and Android - install this on the device you want to test the app on.

### Build and Run

After setting up the required tools, follow the following steps to build and run the app

1. Clone source code and navigate to `src` folder in the terminal
    ```
    git clone https://github.com/1aggarcia/locked-notes.git
    ```
    ```
    cd src
    ```

2. Install dependencies in the `src` folder
    ```
    npm install
    ```

3. Start the development server
    ```
    npx expo start
    ```
    This will produce a QR code in the terminal window

4. Scan the QR code on your test device, through the Camera app on iOS or the Expo Go app on Android.
    - Make sure both the development server and test device are running on the same WiFi network, and that the computer running the development server is configured to use a public network so that it can be discovered by the phone. The trick I like to use is to use my phone's hotspot and connect my laptop to that hotspot.

To build the Android APK, run the below from the `src` folder. You will need an Expo account to do so.

```
eas build -p android --profile preview
```