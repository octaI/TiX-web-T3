import { push } from 'react-router-redux';
import {
  LOGOUT_USER,
  loadFromLocalStorage,
  loadIspFromLocalStorage,
} from '../store/domain/account/actions';

let firstRun = true;

export default function authenticationMiddleware(store) {
  return next => (action) => {
    const { type } = action;

    if (firstRun) {
      firstRun = false;
      const user = localStorage.getItem('user');
      if (user) {
        store.dispatch(loadFromLocalStorage(JSON.parse(user)));
      }
      ///Esto parece innecesario
      // Preferred ISP for searching for user
      const isp = localStorage.getItem('preferredIsp');
      if (isp) {
        store.dispatch(loadIspFromLocalStorage(JSON.parse(isp)));
      }
      ///
    }

    if (type === LOGOUT_USER) {
      localStorage.clear();
      store.dispatch(push('/'));
    }

    return next(action);
  };
}
