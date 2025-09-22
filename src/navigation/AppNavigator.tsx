import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import HomeIcon from '../components/svg-icons/HomeIcon';
import WatchListIcon from '../components/svg-icons/WatchListIcon';
import DbLogo from '../components/svg-icons/DbLogo';

export type RootStackParamList = {
  Main: undefined;
  MovieDetail: {movieId: number};
};

export type TabParamList = {
  Home: undefined;
  Watchlist: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const DbLogoHeader = (props: any) => <DbLogo {...props} />;

const tabBarIcon =
  (routeName: string) =>
  ({color}: {color: string}) => {
    if (routeName === 'Home') {
      return <HomeIcon color={color} />;
    } else if (routeName === 'Watchlist') {
      return <WatchListIcon color={color} />;
    } else {
      return <HomeIcon color={color} />;
    }
  };

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: tabBarIcon(route.name),
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#042541',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarShowLabel: false,
        headerShown: true,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: DbLogoHeader,
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          headerTitle: DbLogoHeader,
          headerTitleAlign: 'center',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MovieDetail"
          component={MovieDetailScreen}
          options={{
            title: '',
            headerTitle: DbLogoHeader,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#fff',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
