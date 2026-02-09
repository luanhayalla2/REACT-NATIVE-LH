import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsSreen';
import RegisterScreen from '../screens/RegisterScreen';
import ListScreen from '../screens/ListScreen';
import LoginScreen from '../screens/LoginScreen';
import EditScreen from '../screens/EditScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
        animationEnabled: true,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerTitle: 'Início',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{
          headerTitle: 'Detalhes',
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          headerTitle: 'Cadastro',
        }}
      />
      <Stack.Screen 
        name="Login"
        component={LoginScreen}
        options={{
          headerTitle: 'Login',
        }}
      />
      <Stack.Screen 
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerTitle: 'Recuperar Senha',
        }}
      />
      <Stack.Screen 
        name="VideoPlayer"
        component={VideoPlayerScreen}
        options={{
          headerTitle: 'Vídeo de Demonstração',
        }}
      />
      <Stack.Screen 
        name="List" 
        component={ListScreen}
        options={{
          headerTitle: 'Usuários',
        }}
      />
      <Stack.Screen 
        name="EditUser" 
        component={EditScreen}
        options={{
          headerTitle: 'Editar Usuário',
        }}
      />
    </Stack.Navigator>
  );
}
