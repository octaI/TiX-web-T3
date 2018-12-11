import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, change } from 'redux-form';
import moment from 'moment';
import Paper from 'material-ui/Paper';
import { DatePicker } from 'redux-form-material-ui';
import './Dashboard.scss';


class SelectDate extends Component {

  componentWillMount() {
    this.state = {
      start: moment().subtract(1, 'day').subtract(1, 'month').toDate(),
      end:   moment().subtract(1, 'day').toDate(),
    };
    this.changeDate = this.changeDate.bind(this);
  }

  changeDate(dates) {
    if (typeof this.props.start != 'undefined') {
      this.props.dispatch(change('selectDate', 'startDate', this.props.start));
      this.props.dispatch(change('selectDate',   'endDate', this.props.end));
    }
    this.props.handleSubmit(dates);
  }

  render() {
    const { handleSubmit, handleChange } = this.props;
    return (
      <Paper style={{ marginTop: '15px' }} zDepth={1}>
        <form className='form-alignment' onSubmit={this.changeDate} onChange={handleChange}>
          <Field name='startDate' component={DatePicker} floatingLabelText='Fecha inicial' />
          <Field name='endDate'   component={DatePicker} floatingLabelText='Fecha final' />
          <button className='btn btn-primary btn-large' type='submit'>Ver últimos datos</button>
        </form>
      </Paper>
    );
  }
}

const validate = values => {
  const errors = {};
  if (values.startDate && values.endDate && values.startDate > values.endDate) {
    errors.endDate = 'No puede ser anterior a la fecha inicial';
  }
  return errors;
};

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
);

SelectDate.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  start: PropTypes.instanceOf(Date),
  end:   PropTypes.instanceOf(Date),
}

const SelectDateView = reduxForm({
  form: 'selectDate',
  initialValues: {
    startDate: new Date(moment().subtract(1, 'day').subtract(1, 'month')),
    endDate:   new Date(moment().subtract(1, 'day')),
  },
  validate,
})(SelectDate);

export default SelectDateView;
