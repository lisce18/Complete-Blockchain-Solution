import React, { useState } from 'react';
import { aboutMe, update, updatePassword } from '../services/user';
import { copyToClipboard, getToken, shortenKey } from '../services/misc';
import { Popup } from './Popup';

export const UserInfo = ({
  setShowUserProfile,
  userInfo,
  setUserInfo,
  handleLogout,
}) => {
  const [editInfo, setEditInfo] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [userInfoChange, setUserInfoChange] = useState({
    email: userInfo.email,
    username: userInfo.username,
    name: userInfo.name,
  });
  const [userPasswordChange, setUserPasswordChange] = useState(false);
  const [displayPopup, setDisplayPopup] = useState('');

  const handleChangeInfo = (e) => {
    const { name, value } = e.target;
    setUserInfoChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setUserPasswordChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    const token = getToken();

    const compareA = userInfo.email + userInfo.username + userInfo.name;
    const compareB =
      userInfoChange.email + userInfoChange.username + userInfoChange.name;

    if (compareA === compareB) {
      return setDisplayPopup({ title: 'Error', text: 'No changes found.' });
    }
    if (token) {
      const response = await update(token, userInfoChange);
      if (response.statusCode === 200) {
        const updatedUserInfo = await aboutMe(token);
        setUserInfo(updatedUserInfo);
        return setDisplayPopup({ title: 'Success', text: 'Details updated' });
      } else {
        return setDisplayPopup({ title: 'Error', text: response.error });
      }
    }
    setEditInfo(false);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (token) {
      const response = await updatePassword(token, userPasswordChange);
      if (response.statusCode === 200) {
        return setDisplayPopup({ title: 'Success', text: 'Password updated' });
      } else {
        console.log(response);
        return setDisplayPopup({ title: 'Error', text: response.error });
      }
    }
    setEditPassword(false);
  };

  const handleEditInfo = (e) => {
    e.preventDefault();
    if (editPassword) setEditPassword(false);
    setEditInfo(true);
  };

  const handleEditPassword = (e) => {
    e.preventDefault();
    if (editInfo) setEditInfo(false);
    setEditPassword(true);
  };

  return (
    <>
      <div className='userinfo-wrapper'>
        <div className='userinfo-frame'>
          <button
            className='exit-button'
            onClick={() => setShowUserProfile(false)}
          >
            X
          </button>
          <div>
            <h2>User info</h2>
            {userInfo && (
              <div className='userinfo'>
                <div>E-mail: {userInfo.email}</div>
                <div>Username: {userInfo.username}</div>
                <div>Name: {userInfo.name}</div>
                <div
                  className='publickey-display'
                  onClick={() => copyToClipboard(userInfo.publicKey)}
                >
                  {' '}
                  Public Key: {shortenKey(userInfo.publicKey)}
                </div>
              </div>
            )}
          </div>
          {editInfo && (
            <form onSubmit={handleSubmitInfo}>
              <h3>Edit info</h3>
              <div className='form-control'>
                <label htmlFor='change-input-email'>E-mail:</label>
                <input
                  type='text'
                  id='change-input-email'
                  name='email'
                  onChange={handleChangeInfo}
                  value={userInfoChange.email}
                  autoComplete='off'
                ></input>
              </div>
              <div className='form-control'>
                <label htmlFor='change-input-username'>Username:</label>
                <input
                  type='text'
                  id='change-input-username'
                  name='username'
                  onChange={handleChangeInfo}
                  value={userInfoChange.username}
                  autoComplete='off'
                ></input>
              </div>
              <div className='form-control'>
                <label htmlFor='change-input-name'>Name:</label>
                <input
                  type='text'
                  id='change-input-name'
                  name='name'
                  onChange={handleChangeInfo}
                  value={userInfoChange.name}
                  autoComplete='off'
                ></input>
              </div>
              <div className='userinfo-button-wrapper'>
                <div className='button-control'>
                  <button className='application-button'>Apply changes</button>
                </div>
                <div className='button-control'>
                  <button
                    className='application-button'
                    onClick={(e) => {
                      e.preventDefault();
                      setEditInfo(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
          {editPassword && (
            <form onSubmit={handleSubmitPassword}>
              <h3>Change password</h3>
              <div className='form-control'>
                <label htmlFor='change-password-old'>Current Password:</label>
                <input
                  type='password'
                  id='change-password-old'
                  name='password'
                  onChange={handleChangePassword}
                ></input>
              </div>
              <div className='form-control'>
                <label htmlFor='change-password-new'>New Password:</label>
                <input
                  type='password'
                  id='change-password-new'
                  name='newpassword'
                  onChange={handleChangePassword}
                ></input>
              </div>
              <div className='userinfo-button-wrapper'>
                <div className='button-control'>
                  <button className='application-button'>Apply changes</button>
                </div>
                <div className='button-control'>
                  <button
                    className='application-button'
                    onClick={(e) => {
                      e.preventDefault();
                      setEditPassword(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
          <section className='userinfo-buttons-wrapper'>
            {!editPassword && !editInfo && (
              <div className='userinfo-button-wrapper'>
                <div className='button-control'>
                  <button
                    className='application-button'
                    onClick={handleEditInfo}
                  >
                    Edit user info
                  </button>
                </div>
                <div className='button-control'>
                  <button
                    className='application-button'
                    onClick={handleEditPassword}
                  >
                    Change password
                  </button>
                </div>
              </div>
            )}
            <div className='button-wrapper'>
              <div
                className='button-control'
                onClick={handleLogout}
              >
                <button className='application-button'>Log out</button>
              </div>
            </div>
          </section>
        </div>
      </div>
      {displayPopup !== '' && (
        <Popup
          setDisplayPopup={setDisplayPopup}
          displayPopup={displayPopup}
        />
      )}
    </>
  );
};
