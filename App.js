import React, { useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import Realm from "realm";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./navigator";
import { DBContext } from "./context";

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
      await SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }
  return (
    <DBContext.Provider value={realm}>
      <NavigationContainer>
        <Navigator />
        <View onLayout={onLayoutRootView} />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
