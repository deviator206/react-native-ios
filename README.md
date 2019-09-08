# react-native-ios
basic boiler plate of iOS With Navigation and. VectorIcons added package JSON


# react native
ERROR: 
error Failed to build iOS project. We ran "xcodebuild" command but it exited with error code 65

Solution: clean up the build folder from ios, rerun the react-native run-ios


@0.59.0
add 3rd party and also make sure that you run the link


# Adding custom fonts to react native app <with react native <= 0.59.0 
1. add the fonts folder
2. make this entry in PACKAGE.json
"rnpm": {
    "assets": ["./assets/fonts/"]
  },
3. execute command react-native link

