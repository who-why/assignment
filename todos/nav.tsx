import React from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { useOAuth, useUser } from '@clerk/clerk-expo';
import { useClerk } from '@clerk/clerk-react';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const Nav = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const onSignOut = React.useCallback(async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  }, [signOut]);

  return (
    <View style={styles.navbar}>
      <Text style={styles.navItem}>Todo-App</Text>

      {!isSignedIn ? (
        <TouchableOpacity style={styles.signInButton} onPress={onPress}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.userProfile}>
          <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{user?.firstName}</Text>
            <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
              <Text style={styles.signOutButtonText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Nav;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
  },
  navItem: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  profileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 15,
  },
  signOutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#03DAC6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
