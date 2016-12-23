cordova create ptest fmt.test Test
cd ptest/
cordova platform add android
cordova plugin add ../sensor-plugin/org.apache.cordova.device-motion/
cordova plugin ls

-->should list device motion here
