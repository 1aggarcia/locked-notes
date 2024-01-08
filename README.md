# Overview

This is a simple notes app offering encrypted protection of notes via numerical PIN, designed for iOS and Android.

Upon first usage after installation, the user is propmted to set a 6 digit PIN required for entry into the app. At the moment PIN resetting is not avaliable but is under development. One the PIN is set, the app will unlock for 5 minutes before automatically locking again. At the top of the screen, the user may manually lock the app at any time with the "Lock" button.

In the unlocked state, a list of all notes is shown. Tapping a note opens the edit view for that note, long the node shows details about its file. All files are encrypted in external storage. In the edit view for any note, all changes are automatically saved.

## Source Code

This app is built in TypeScript using the React Native framework and the Expo platform.

### Software Setup

The following software tools are required to build and run the app:
- Git (confirm installation with `git -v`)
- Node.js (confirm installation with `node -v`)
- Expo Go app installed on test device


### Build and Run

After setting up the required tools, follow the following steps to build and run the app

1. Clone source code
    ```
    git clone https://github.com/1aggarcia/locked-notes.git
    ```

2. Navigate to `src` folder in the terminal 

3. Install dependencies in the `src` folder
    ```
    npm install
    ```

4. Start the development server
    ```
    npx expo start
    ```

5. Scan the QR code produced in the terminal with the Expo Go app for Android, or the Camera app for iOS.