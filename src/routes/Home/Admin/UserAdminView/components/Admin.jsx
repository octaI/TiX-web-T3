import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField'
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
    constructor(props){
        super(props);
        this.state = {searchValue: ''}
    }
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
          onTouchTap={() => {
            if (window.confirm('¿Está seguro de que desea realizar esta acción?')) {
              changeRole(id, role === 'admin' ? 'user' : 'admin')
            }
          }}
          className='btn btn-info'
          style={{ marginLeft: '5px' }}
        >
          {buttonText}
        </span>
      );
    }
    return <span></span>;
  }
  renderSingleUser(user,impersonateUserFunc,changeRole,currentUser){
        return <TableRow key={user.id}>
            <TableRowColumn width={100}>{user.id}</TableRowColumn>
            <TableRowColumn width={250}>{user.username}</TableRowColumn>
            <TableRowColumn>{user.measure_count}</TableRowColumn>
            <TableRowColumn>{user.role}</TableRowColumn>
            <TableRowColumn>
                <div>
                    {this.impersonateButton(currentUser, user.id, user.username)}
                    {this.changeRoleButton(currentUser, user.id, user.username, user.role)}
                </div>
            </TableRowColumn>
        </TableRow>
  }
  sortUsers(users) {
    function compare(u1, u2) {
      if (u1.measure_count > u2.measure_count)
        return -1;
      if (u1.measure_count < u2.measure_count)
        return 1;
      if (u1.id < u2.id)
        return -1;
      return 1;
    }
    return users.sort(compare);
  }
  renderUsers(users, impersonateUserFunc, changeRole,searchValue='') {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (searchValue !== '') {
        return this.sortUsers(users).filter((user) => {
            return user.username .includes(searchValue);
        }).map(user => (
            this.renderSingleUser(user,impersonateUserFunc,changeRole,currentUser)
        ));
    }
    return this.sortUsers(users).map(user => (
        this.renderSingleUser(user,impersonateUserFunc,changeRole,currentUser)
    ));
  }

  handleTextFieldOnChange(users,impersonateUserFunc,changeRole,event) {
     this.setState({searchValue: event.target.value});
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
            <TextField
                floatingLabelText={'Buscar usuario por nombre'}
                onChange={(e) => this.handleTextFieldOnChange(users,impersonateUserFunc,changeRole,e)}
                style={{ marginLeft: '15px' }}
            >

            </TextField>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn width={100}>#</TableHeaderColumn>
                <TableHeaderColumn width={250}>Nickname</TableHeaderColumn>
                <TableHeaderColumn># mediciones</TableHeaderColumn>
                <TableHeaderColumn>Rol</TableHeaderColumn>
                <TableHeaderColumn>Acciones</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover>
              {this.renderUsers(users, impersonateUserFunc, changeRole,this.state.searchValue)}
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
