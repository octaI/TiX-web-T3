import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import R from 'ramda';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import {
  fetchAdminReports,
  fetchLastAdminReportDate
} from '../../../../../store/domain/report/actions';
import HistogramChart from '../../../../../components/Charts/HistogramChart';
import FiltersForm from './FiltersForm';
import { fetchProviders } from '../../../../../store/domain/provider/actions';

class IspCharts extends Component {

  componentWillMount() {
    this.props.fetchProviders(this.props.user.id);
    this.setState({
      version: 0,
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      startDate: moment().format('YYYY-MM-DD'),
    });
    this.fetchLastDataPoint(this.props);
    this.isMeasureIncluded = this.isMeasureIncluded.bind(this);
    this.filterReports = this.filterReports.bind(this);
    this.fetchLastDataPoint = this.fetchLastDataPoint.bind(this);
    this.showLastMonthOfData = this.showLastMonthOfData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reports && this.state.version !== nextProps.reports.version) {
      this.calculateBins(nextProps.reports);
    }
    this.fetchLastDataPoint(nextProps);
  }

  fetchLastDataPoint(props) {
    const prov = this.state && this.state.filters ? this.state.filters.isp
      : (this.props.provider ? this.props.provider : 1);
    props.fetchLastAdminReportDate(prov, moment().format('YYYY-MM-DD'));
  }

  isMeasureIncluded(f, mDate) {
    return (
      (!f.dayOfWeek || f.dayOfWeek === 0 || mDate.day() === (f.dayOfWeek - 1))
      && (!f.startTime ||  f.startTime <= mDate.hour())
      && (!f.endTime   || mDate.hour() <= f.endTime)
    ); // Faltaría chequear startDate <= endDate y startTime <= endTime
  }

  calculateBins(measures) {
    const filters = this.state.filters;
    this.upUsageBins = new Array(10).fill(0);
    this.downUsageBins = new Array(10).fill(0);
    this.upQualityBins = new Array(10).fill(0);
    this.downQualityBins = new Array(10).fill(0);
    this.theresData = false;
    measures.forEach((measure) => {
      if (this.isMeasureIncluded(filters, moment(measure.timestamp))) {
        this.assignBins(this.upUsageBins, measure.upUsage);
        this.assignBins(this.downUsageBins, measure.downUsage);
        this.assignBins(this.upQualityBins, measure.upQuality);
        this.assignBins(this.downQualityBins, measure.downQuality);
        this.theresData = true;
      }
    });
  }

  assignBins(binsArray, value) {
    let w = 0;
    for (let i = 0.101; i < 1.1; i += 0.1) {
      if (value <= i) {
        binsArray[w] += 1;
        return;
      }
      w++;
    }
  }

  showLastMonthOfData() {
    const lastDate = this.props.lastDate;
    if (lastDate) {
      const lastReportDate = moment(lastDate, "YYYY-MM-DDTHH:mm:ss.SSSSZ");
      const end = lastReportDate.format('YYYY-MM-DD');
      const start = lastReportDate.subtract(1, 'month').format('YYYY-MM-DD');
      this.setState({
        startDate: start,
        endDate: end,
      });
      const prov = this.state && this.state.filters ? this.state.filters.isp
        : (this.props.provider ? this.props.provider : 1); // ToDo: hardcodeo
      this.props.fetchAdminReports(prov, start, end);
    } else {
      this.fetchLastDataPoint(this.props);
    }
  }

  filterReports(data) {
    this.state.filters = data;
    this.props.fetchAdminReports(data.isp,
      moment(data.startDate).format('YYYY-MM-DD'),
      moment(data.endDate).format('YYYY-MM-DD'));
  }

  renderHistograms() {
    if (!this.upUsageBins) {
      return <div />;
    } else if (!this.theresData) {
      return (
        <Card className='card-margins'>
          <CardText>
            <span>No hay datos para estos filtros</span>
          </CardText>
        </Card>
      );
    }
    return (
      <Card className='card-margins'>
        <CardTitle
          title='Reporte para ISP: '
          subtitle='Histogramas para los rangos de fechas definidos en los filtros'
        />
        <CardText>
          <div className='row'>
            <div className='col-md-6'>
              <HistogramChart
                data={this.upUsageBins}
                description='Utilización Subida'
                title='Histograma Utilización Subida'
              />
            </div>
            <div className='col-md-6'>
              <HistogramChart
                data={this.downUsageBins}
                description='Utilización Bajada'
                red
                title='Histograma Utilización Bajada'
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <HistogramChart
                data={this.upQualityBins}
                description='Calidad Subida'
                title='Histograma Calidad Subida'
              />
            </div>
            <div className='col-md-6'>
              <HistogramChart
                data={this.downQualityBins}
                description='Calidad Bajada'
                red
                title='Histograma Calidad Bajada'
              />
            </div>
          </div>
        </CardText>
      </Card>
    );
  }

  renderCsvDownload() {
    const {
      providers,
      provider,
    } = this.props;
    let selectedProviderName = "";
    if (this.state.filters) {
      const ispId = this.state.filters.isp;
      if (providers[ispId]) {
        selectedProviderName = providers[ispId].name;
      }
    }
    if (!this.upUsageBins || !this.theresData) {
      return <div />;
    }
    return (
      <Card className='card-margins'>
        <CardTitle
          title='Descarga de CSV'
          subtitle='Descargar los datos RAW (del rango de fechas para el ISP) para análisis'
        />
        <CardText>
          <CSVLink
            data={this.props.reports}
            separator={','}
            filename={`reporte-${selectedProviderName}.csv`}>
            Descargar
          </CSVLink>
        </CardText>
      </Card>
    );
  }

  render() {
    const {
      providers,
    } = this.props;
    return (
      <div>
        <FiltersForm
          providers={providers}
          onSubmit={this.showLastMonthOfData}
          onChange={this.filterReports}
          start={moment(this.props.lastDate, 'YYYY-MM-DD').subtract(1, 'month').toDate()}
          end={  moment(this.props.lastDate, 'YYYY-MM-DD').toDate()}
        />
        {this.renderCsvDownload()}
        {this.renderHistograms()}
      </div>
    );
  }
}

IspCharts.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      version: PropTypes.number,
      upUsage: PropTypes.number,
      downUsage: PropTypes.number,
      upQuality: PropTypes.number,
      downQuality: PropTypes.number,
    })
  ),
  lastDate: PropTypes.string,
  providers: PropTypes.shape({
    name: PropTypes.string,
  }),
  provider: PropTypes.number,//PropTypes.string,
  fetchProviders: PropTypes.func,
  fetchAdminReports: PropTypes.func,
  fetchLastAdminReportDate: PropTypes.func,
};

const mapStateToProps = store => ({
  user: store.account.user,
  reports: R.path(['reports', 'adminReport'], store),
  lastDate: R.path(['reports', 'adminLastDate'], store),
  provider: store.reports.provider,
  version: store.reports.version,
  providers: store.providers,
});

const mapDispatchToProps = dispatch => ({
  fetchProviders: userId =>
    dispatch(fetchProviders(userId)),
  fetchAdminReports: (isp, startDate, endDate) =>
    dispatch(fetchAdminReports(isp, startDate, endDate)),
  fetchLastAdminReportDate: (isp, endDate) =>
    dispatch(fetchLastAdminReportDate(isp, endDate)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IspCharts);
