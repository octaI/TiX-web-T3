import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import Paper from 'material-ui/Paper';
import { DatePicker } from 'redux-form-material-ui';
import './Dashboard.scss';


class SelectDate extends Component {

  render() {
    const { handleSubmit, handleChange } = this.props;
    return (
      <Paper style={{ marginTop: '15px' }} zDepth={1}>
        <form className='form-alignment' onSubmit={handleSubmit} onChange={handleChange}>
          <Field name='startDate' component={DatePicker} floatingLabelText='Fecha Inicio' />
          <Field name='endDate'   component={DatePicker} floatingLabelText='Fecha Final' />
          <button className='btn btn-primary btn-large' type='submit'>Ver últimos datos</button>
        </form>
      </Paper>);
  }
}

SelectDate.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
}

const SelectDateView = reduxForm({
  form: 'selectDate',
  initialValues: {
    startDate: new Date(moment().subtract(1, 'day').subtract(1, 'month')),
    endDate:   new Date(moment().subtract(1, 'day'))
  },
})(SelectDate);

export default SelectDateView;
