import React from 'react';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  const date = new Date(additionalText)
  const monthText = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  const dayText = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const hoursText = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minuteText = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  const dateText = `${date.getFullYear()}-${monthText}-${dayText} ${hoursText}:${minuteText}`

  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={avatarUrl || '/noavatar.png'} alt={fullName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{dateText}</span>
      </div>
    </div>
  );
};
