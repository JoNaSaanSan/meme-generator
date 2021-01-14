import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientId =
  '89707895112-7ekjj49i0ibag5dra96jrr8gcfajj89l.apps.googleusercontent.com';

function Logout() {
  const onSuccess = () => {
    console.log('Logout made successfully');
    alert('Logout made successfully ✌');
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;