import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import ReCAPTCHA from 'react-google-recaptcha';
import Paper from 'material-ui/Paper';
import {
  TextField,
} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';


const Captcha = props => (
  <ReCAPTCHA
    sitekey='6LexqSAUAAAAAKD-PBs2MePg0TCpRuyFi4-HJ66R'
    onChange={props.input.onChange}
  />
);

Captcha.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
  }),
};

class RegisterForm extends Component {

  render() {
    const { handleSubmit } = this.props;
    return (
      <div style={{ margin: '20px 0px' }}>
        <Paper>
          <h3 className='log-in-header'>{ 'Registrarse' }</h3>
          <div>
            <form onSubmit={handleSubmit} className='hgroup'>
              <Field type='text' name='username' component={TextField} floatingLabelText='Email' />
              <Field type='password' name='password1' component={TextField} floatingLabelText={'Contraseña'} />
              <Field type='password' name='password2' component={TextField} floatingLabelText={'Contraseña'} />
              <Field name='captcharesponse' component={Captcha} />
              <RaisedButton
                style={{ marginBottom: '15px' }}
                className='button-size'
                primary
                label='Registrarse'
                type='submit'
              />
            </form>
          </div>
        </Paper>
      </div>
    );
  }
}

const asyncValidate = values => {
    const email_domain = values.username.split("@")[1] //grab the domain name
    return new Promise((resolve,reject) => {
        fetch('https://dns-api.org/MX/'+email_domain).then(data => {
            console.log(data.status);
            if (data.status !== 200) {
                reject({username: 'El dominio de email no es válido'});
            } else {
                resolve();
            }

        })
    })
};

const validate = values => {
    const errors = {};
    if (!values.username)  {
        errors.username = 'Requerido'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
        errors.username = 'Dirección de email inválida';
    }
    if (!values.password1) {
      errors.password1 = 'Requerido'
    } else  if (values.password1 !== values.password2){
        errors.password2 = 'Las contraseñas no coinciden'
    }
    if (!values.password2) {
      errors.password2 = 'Requerido'
    }


  return errors;
};

const renderField = ({ input, label, type, meta: { asyncValidating, touched, error } }) => (
    <div>
        <label>{label}</label>
        <div>
            <input {...input} placeholder={label} type={type}/>
            {touched && error && <span>{error}</span>}
        </div>
    </div>
)

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
};

const ReduxRegisterForm = reduxForm({
    form: 'register',
    validate,
    asyncValidate
})(RegisterForm);

export default ReduxRegisterForm;
