import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import R from 'ramda';
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import SnackBar from 'material-ui/Snackbar'
import Badge from 'material-ui/Badge'
import Card from 'material-ui/Card'
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { push } from 'react-router-redux';
import './Header.scss';
import { logoutUser, stopImpersonation } from '../../store/domain/account/actions';
import Alert from '../../components/Alert';
import { removeAlert } from '../../store/domain/alerts/actions';

const renderLeftIcon = (user, logout, stopImpersonalization) => {
  if (!user) {
    return <FlatButton href='/about' label='Sobre el proyecto' />;
  }

  const menuItems = [(
    <MenuItem
      key='closeSession'
      onTouchTap={logout}
      primaryText='Cerrar sesión'
    />
  )];
  if (user.isImpersonating) {

      return (
          <div>
              <FlatButton
                  label={'Impersonando a: ' + user.username}
                  style={{marginRight: 'auto'}}
                  labelStyle={{color: '#ffffff'}}
              >
              </FlatButton>

              <RaisedButton onTouchTap={stopImpersonalization}
                            backgroundColor={'#559ac6'}
                            style={{ marginRight: '50px'}}
                            label='Terminar Impersonalizacion'
              ></RaisedButton>
              <IconMenu
                  iconButtonElement={
                      <IconButton><MoreVertIcon /></IconButton>
                  }
              >
                  {menuItems}
              </IconMenu>
          </div>)
  }
  return (
      <div>
          <IconMenu
              iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
              }
          >
              {menuItems}
          </IconMenu>
      </div>


  );
};



export const Header = props => (
  <header>
    <AppBar
      title='TiX'
      showMenuIconButton={false}
      iconElementRight={renderLeftIcon(props.user, props.logoutUser, props.stopImpersonationFunc)}
      style={{ backgroundColor: '#c64e31' }}
      onTitleTouchTap={props.redirectToHome}
    />
    <div className='beta-banner'>{ 'Versión Beta' }</div>
    <Alert alerts={props.alerts} clearAlert={props.clearAlert} />
  </header>
);

Header.propTypes = {
  alerts: PropTypes.shape({
    message: PropTypes.string,
    id: PropTypes.string,
  }),
  user: PropTypes.shape({
    isImpersonating: PropTypes.boolean,
    username: PropTypes.string,
  }),
  clearAlert: PropTypes.func,
  stopImpersonationFunc: PropTypes.func,
  logoutUser: PropTypes.func,
  redirectToHome: PropTypes.func,
};

const mapStateToProps = store => ({
  user: store.account.user,
  alerts: R.pathOr({}, ['alerts'], store),
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  stopImpersonationFunc: () => dispatch(stopImpersonation()),
  clearAlert: id => dispatch(removeAlert(id)),
  redirectToHome: () => dispatch(push('/')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
