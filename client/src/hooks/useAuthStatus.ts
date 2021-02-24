
import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify'
import { Hub } from '@aws-amplify/core';

function useAuthStatus() {
  let [user, setUser] = useState(null)
  
  useEffect(() => {
    let updateUser = async () => {
      try {
        let user = await Auth.currentAuthenticatedUser()
        setUser(user)
      } catch {
        setUser(null)
      }
    }
    Hub.listen('auth', updateUser) // listen for login/signup events

   // we are not using async to wait for updateUser, so there will be a flash of page where the user is assumed not to be logged in. If we use a flag 
    updateUser() // check manually the first time because we won't get a Hub event
    return () => Hub.remove('auth', updateUser) // cleanup
  }, []);

  return user;
}

export default useAuthStatus;
