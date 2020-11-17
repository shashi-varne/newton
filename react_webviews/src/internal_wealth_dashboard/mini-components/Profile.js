import React from 'react';

function Profile({ src }) {
  return (
    <picture className="iwd-profile-picture">
      <img src={src} alt="Profile Image" />
    </picture>
  )
}

export default Profile;