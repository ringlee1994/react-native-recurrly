const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = withNativewind(getDefaultConfig(__dirname));

// Workaround: react-native-css 3.1.0-rc.0 (used by NativeWind v5) redirects
// "react-native" imports to a wrapper that doesn't re-export AssetRegistry.
// That breaks expo-asset, so useFonts never loads. Let expo-asset import the
// real react-native. Remove once NativeWind ships a react-native-css release
// that re-exports AssetRegistry.
const nativewindResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "react-native" &&
    /[\\/]node_modules[\\/]expo-asset[\\/]/.test(context.originModulePath)
  ) {
    return context.resolveRequest(context, moduleName, platform);
  }
  return nativewindResolve(context, moduleName, platform);
};

module.exports = config;
