import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { clearState, fetchUserBytoken, userSelector } from '../redux/slices/UserSlice';
import { getKeyInStorage, removeKeyInStorage } from '../helpers/ManageStore';

const Dashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {isError, isFetching} = useSelector(userSelector);

  useEffect(() => {
    dispatch(fetchUserBytoken({token: getKeyInStorage('token')}));
  }, [dispatch]);

  const {username, email, avatar} = useSelector(userSelector);

  useEffect(() => {
    if (isError) {
      dispatch(clearState());
      history.push('/login');
    }
  }, [dispatch, history, isError]);

  const onLogOut = () => {
    removeKeyInStorage('token');
    history.push('/login');
  }

  return (
    <div className="container mx-auto">
      {isFetching ? (
        <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
      ) : (
        <>
          <div className="container mx-auto">
            <img src={avatar} alt="asdasd" />
            <p>Welcome back</p> <h3>{username}</h3>{email}
            
          </div>

          <button
            onClick={onLogOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
}

export default Dashboard
