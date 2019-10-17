# Notarizing Assistant
A utility plugin for notarizing other plugins that contain frameworks or bundles.

Starting from macOS 10.15 Catalina, Apple requires all frameworks and app bundles to be code signed and notarized. If your Sketch plugin includes a framework or bundle, it needs to be notarized. Without notarizing, your plugins will fail to load and users will see a message saying Apple cannot verify its identify.

![Integrity Error Message](img/integrity-error.png?raw=true)


Notarizing Assistant helps you notarize your plugins before releasing.


## Requirements

#### A paid Apple Developer account
Enrolling in the Apple Developer Program costs $99/year.
You must also have two-factor authentication enabled.
Create a new account, or upgrade to a paid plan: [https://developer.apple.com](https://developer.apple.com)

#### An app-specific password
Since two-factor authentication is required for your account, you will also need to create an app-specific password to use when submitting your plugin for notarizing.  

Follow the instructions here to create one: [https://support.apple.com/en-us/HT204397](https://support.apple.com/en-us/HT204397)

#### A Developer ID Application Certificate saved in your local Keychain
If you don’t have one saved in your local Keychain you can create a new certificate or download an existing certificate. 

![Create Certificate](img/create-certificate.png?raw=true)

1. Go to Xcode → Preferences → Accounts  
2. Select your Developer Account (or sign in if you don’t see it) and select “Manage Certificates”  
3. Click the `+` button and select `Developer ID Application` to create a new certificate  


## Setup your credentials

You will need to notarize your plugin every time you make a change to the framework. Notarizing Assistant helps you securely save your app-specific password to your local Keychain so you can access it again in the future.

To save your credentials, launch the plugin by going to `Plugins → Notarizing Assistant`

![Setup Credentials](img/setup-credentials.png?raw=true)

Enter your Certificate Name, which is usually the value displayed in the `Creator` column in Xcode’s Manage Certificates window (see above).

Enter the appropriate Team ID if your account is associated with multiple teams. If not, just leave this blank.

Enter the email address associated with your Apple ID.

Enter the app-specific password you created in the Requirements step above. 
> Note: **Do not enter your actual Apple ID password.** That will not work since we have no way of initiating or validating a two-factor authentication flow.

Hit **Save**.


## Notarizing a Plugin

If you have at least one signing authority saved, you can start notarizing your plugins. If you wish to sign different plugins using different signing authorities, you can add or remove signing authorities by clicking the `+` or `-` buttons.

![Notarize](img/notarizing.png?raw=true)

Select the code signing authority you would like to use.

Select the plugin you want to notarize. Only plugins that contain a framework or bundle need to be notarized, so we’ll only show you those plugins to choose from.

Hit **Notarize**!

The plugin will run the appropriate bash commands to initiate notarizing the selected plugin. In the console you will see:  
- the command being executed (in gray)  
- the response from the commands (in black/white)  
- some explanation of what is happening (in orange)  
- completion messages (in green)  
- errors (in red)


## Behind the scenes

The plugin performs the following commands behind the scenes:

1. We traverse the folders within your plugin to find bundles with a `.framework` or `.bundle` extension.  

2. For **each** of these bundles:  
	- We locate the executable binary  
	- Verify if the bundle has been code signed  
		```bash
    codesign -dvv “path/to/binary”
    ```  
	- Code sign the binary if required  
		```bash
    codesign -f -s ”Developer ID Application: Gita Kumar” --timestamp --identifier ”com.binary.identifier” ”path/to/binary”
    ```  

3. Archive the plugin bundle  
  ```bash
  zip -r ”path/to/zip” ”path/to/bundle.sketchplugin”
  ```  

4. Submit the zip for notarizing  
  ```bash
  xcrun altool --notarize-app -f ”path/to/zip” --primary-bundle-id ”plugin.bundle.identifier” -u ”your-apple-id-email@email.com” -p ”your-app-specific-password” --asc-provider ”your-team-id”
  ```  


When Apple accepts your plugin bundle for notarizing, we receive a response containing a unique `RequestUUID`. We save this request ID on your computer and use it to check the status of our notarizing request. All requests show up in the **History** tab.


## History

![Notarize](img/history.png?raw=true)

All notarizing requests are saved locally on your computer and are accessible in the History tab. Apple usually takes a few minutes to notarize your plugin bundle and sends you an email with the result.

In the History tab we periodically refresh the status using `altool` (every 30 seconds) while a request is in progress  
  ```bash
  xcrun altool --notarization-info "<requestID>" -u "your-apple-id-email@email.com" -p "your-app-specific-password"
  ```  

We also save a link to the log file for the request, which is mostly useful when checking for errors in case notarizing fails.

From the History tab you can also quickly notarize a plugin again if you’ve made changes to it. This is merely a shortcut for submitting a new notarizing request for the associated plugin bundle.


## Disclaimer

I’ve tested the plugin for my own use cases but, given all the variables in this process, if you encounter some errors please [Create an Issue](https://github.com/abynim/sketch-notarizing-assistant/issues/new) in this repo with as much information as possible. I will do my best to fix issues but I make no guarantees. Remember to obfuscate any personally identifying information when creating issues and posting screenshots.


## Privacy

The plugin does not capture or transmit any information online, except when submitting your plugin directly to Apple servers. All your credentials and signing authorities are saved locally on your computer. Passwords are saved securely to Keychain, so you may need to enter your computer password to access it in the future.


## Plugs 🤓

I make plugins for Sketch, including:  

[Sketch Runner](https://sketchrunner.com) - Design faster in Sketch

[User Flows](https://abynim.github.io/UserFlows/) - A plugin for generating flow diagrams from Artboards in Sketch.  

[Lippy](https://github.com/abynim/lippy) - An interactive Lorem-ipsum generator plugin for Sketch.

You can find me on Twitter [@abynim](https://twitter.com/abynim)