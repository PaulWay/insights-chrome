import React, { useEffect, useState } from 'react';
import { Avatar } from '@patternfly/react-core';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../redux/store';

const UserIcon = () => {
  const username = useSelector(({ chrome }: ReduxState) => chrome.user?.identity.user?.username);
  const [avatar, setAvatar] = useState('/apps/chrome/assets/images/img_avatar.svg');

  const getImage = (img: HTMLImageElement) => {
    if (img.width === 140) {
      setAvatar(img.src);
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src = `https://access.redhat.com/api/users/avatar/${username}/`;
    img.onload = () => getImage(img);
  }, []);

  return <Avatar src={avatar} alt="User Avatar" />;
};

export default UserIcon;
