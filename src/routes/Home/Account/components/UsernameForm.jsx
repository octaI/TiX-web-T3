import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Paper from 'material-ui/Paper';
import {
  TextField,
} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';

class UsernameForm extends Component {

  render() {
    const { handleSubmit } = this.props;
    return (
      <Paper>
        <form className='form-alignment form-display' onSubmit={handleSubmit}>
          <h4>{'Editar email'}</h4>
          <TextField
            type='string'
            name='username'
            hintText={this.props.user.username}
            floatingLabelText='Email' />
          <Field
            type='password'
            component={TextField}
            floatingLabelText={'Contraseña Actual'}
            name='oldPassword' />
          <RaisedButton className='settings-button-margin' label='Guardar Cambios' type='submit' />
        </form>
      </Paper>);
  }
}

UsernameForm.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
  handleSubmit: PropTypes.func,
};

const UsernameFormView = reduxForm({
  form: 'usernameForm',
})(UsernameForm);

export default UsernameFormView;
