import React, { useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import Realm from "realm";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./navigator";
import { DBContext } from "./context";
import { AppOpenAd, BannerAd, TestIds } from "react-native-google-mobile-ads";

SplashScreen.preventAutoHideAsync();

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [realm, setRealm] = useState(null);
  const startLoading = async () => {
    const connection = await Realm.open({
      path: "nomadDiaryDB",
      schema: [FeelingSchema],
    });
    setRealm(connection);
  };
  const onFinish = () => setReady(true);
  useEffect(() => {
    async function prepare() {
      try {
        await startLoading();
      } catch (e) {
        console.warn(e);
      } finally {
        onFinish(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync(); // Show the app open ad when user brings the app to the foreground.
    }
  }, [ready]);

  if (!ready) {
    return null;
  }
  return (
    <DBContext.Provider value={realm}>
      <NavigationContainer>
        <BannerAd unitId={TestIds.BANNER} size="BANNER" />
        <Navigator />
        <View onLayout={onLayoutRootView} />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
