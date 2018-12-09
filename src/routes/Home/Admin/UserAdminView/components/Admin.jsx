import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import R from 'ramda';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { fetchAllUsers, impersonateUser, editRole } from '../../../../../store/domain/account/actions';

class AdminView extends Component {

  componentWillMount() {
    this.props.fetchAllUsers();
    this.impersonateButton = this.impersonateButton.bind(this);
    this.changeRoleButton = this.changeRoleButton.bind(this);
  }

  impersonateButton(currentUser, id, username) {
    if (username !== 'admin' && (!currentUser || currentUser['username'] !== username)) {
      return (
        <span onTouchTap={() => this.props.impersonateUserFunc(id)} className='btn btn-info'>
          Impersonar
        </span>
      );
    } else {
      return <span></span>;
    }
  }

  changeRoleButton(currentUser, id, username, role) {
    if (currentUser && currentUser["username"] === 'admin' && username !== 'admin') {
      const buttonText = (role === 'admin' ? '+ Rol' : '- Rol');
      return (
        <span
          onTouchTap={() => {if(window.confirm('Está seguro que desea realizar esta acción?')){changeRole(id, role === 'admin' ? 'user' : 'admin')} }}
          className='btn btn-info'
          style={{ marginLeft: '5px' }}
        >
          {buttonText}
        </span>
      );
    }
    return <span></span>;
  }

  renderUsers(users, impersonateUserFunc, changeRole) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    return users.map(user => (
      <TableRow key={user.id}>
        <TableRowColumn>{user.id}</TableRowColumn>
        <TableRowColumn>{user.username}</TableRowColumn>
        <TableRowColumn>{user.role}</TableRowColumn>
        <TableRowColumn>
          <div>
            {this.impersonateButton(currentUser, user.id, user.username)}
            {this.changeRoleButton(currentUser, user.id, user.username, user.role)}
          </div>
        </TableRowColumn>
      </TableRow>
    ));
  }

  render() {
    const {
      users,
      impersonateUserFunc,
      changeRole,
    } = this.props;

    return (
      <Card className='card-margins'>
        <CardTitle
          title='Administración de usuarios'
          subtitle='Visualizar e impersonalizar los usuarios del sistema'
        />
        <CardText>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>#</TableHeaderColumn>
                <TableHeaderColumn>Nickname</TableHeaderColumn>
                <TableHeaderColumn>Rol</TableHeaderColumn>
                <TableHeaderColumn>Acciones</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover>
              {this.renderUsers(users, impersonateUserFunc, changeRole)}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }
}

AdminView.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.sring,
    role: PropTypes.string,
  })),
  impersonateUserFunc: PropTypes.func,
  fetchAllUsers: PropTypes.func,
  changeRole: PropTypes.func,
};

const mapStateToProps = store => ({
  users: R.pathOr([], ['account', 'users'], store),
});

const mapDispatchToProps = dispatch => ({
  fetchAllUsers: () => dispatch(fetchAllUsers()),
  impersonateUserFunc: id => dispatch(impersonateUser(id)),
  changeRole: (userId, role) => dispatch(editRole(userId, role)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminView);
