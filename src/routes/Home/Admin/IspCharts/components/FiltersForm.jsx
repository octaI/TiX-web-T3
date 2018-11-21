import React, { Component } from 'react';
import { Field, reduxForm, change } from 'redux-form';
import moment from 'moment';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import {
  DatePicker,
  TextField,
  SelectField,
} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardTitle, CardText } from 'material-ui/Card';

const required = value => value ? undefined : 'Requerido';

class FiltersForm extends Component {

  componentWillMount() {
    this.state = {
      start: moment().subtract(1, 'day').subtract(1, 'month').toDate(),
      end:   moment().subtract(1, 'day').toDate(),
    };
    this.changeDate = this.changeDate.bind(this);
  }

  changeDate(a) {
    if (typeof this.props.start != 'undefined') {
      this.props.dispatch(change('filterForm', 'startDate', this.props.start));
      this.props.dispatch(change('filterForm',   'endDate', this.props.end));
    }
    this.props.handleSubmit(a);
  }

  render() {
    const { providers, handleSubmit, handleChange } = this.props;
    if (Object.keys(providers).length === 0) {
      return <span>wait</span>;
    }
    return (
      <Card className='card-margins'>
        <CardTitle
          title='Filtros de reporte'
        />
        <CardText>
          <form onSubmit={this.changeDate} onChange={handleChange}>
            <div className='row'>
              <div className='col-md-4'>
                <Field name='startDate' component={DatePicker} floatingLabelText='Fecha inicio' validate={[required]} />
                <Field name='endDate'   component={DatePicker} floatingLabelText='Fecha final'  validate={[required]} />
              </div>
              <div className='col-md-4'>
                <Field name='dayOfWeek' component={SelectField} floatingLabelText='Día de la semana' >
                  <MenuItem value='0' primaryText='Todos' />
                  <MenuItem value='1' primaryText='Lunes' />
                  <MenuItem value='2' primaryText='Martes' />
                  <MenuItem value='3' primaryText='Miércoles' />
                  <MenuItem value='4' primaryText='Jueves' />
                  <MenuItem value='5' primaryText='Viernes' />
                  <MenuItem value='6' primaryText='Sábado' />
                  <MenuItem value='7' primaryText='Domingo' />
                </Field>
                <Field name='isp' component={SelectField} floatingLabelText='ISP' validate={[required]}>
                  {Object.keys(providers).map(key =>
                    <MenuItem key={key} value={providers[key].id} primaryText={providers[key].name} /> )}
                </Field>
              </div>
              <div className='col-md-4'>
                <Field name='startTime' component={TextField} floatingLabelText='Hora inicio' />
                <Field name='endTime'   component={TextField} floatingLabelText='Hora final' />
              </div>
            </div>
            <RaisedButton className='settings-button-margin' label='Ver últimos datos' type='submit' />
          </form>
        </CardText>
      </Card>
    );
  }
}

FiltersForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  providers: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  start: PropTypes.instanceOf(Date),
  end:   PropTypes.instanceOf(Date),
};

const FiltersFormView = reduxForm({
  form: 'filterForm',
  initialValues: {
    startDate: new Date(moment().subtract(1, 'day').subtract(1, 'month')),
    endDate:   new Date(moment().subtract(1, 'day')),
    isp:       1, // ToDo
  },
})(FiltersForm);

export default FiltersFormView;
