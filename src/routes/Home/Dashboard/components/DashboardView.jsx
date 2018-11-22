import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import R from 'ramda';
import BottomArrow from 'material-ui/svg-icons/editor/vertical-align-bottom';
import TopArrow from 'material-ui/svg-icons/editor/vertical-align-top';
import BothArrow from 'material-ui/svg-icons/editor/vertical-align-center';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import DashboardChart from '../../../../components/Charts/DashboardChart';
import { fetchReports, fetchLastReportDate } from '../../../../store/domain/report/actions';
import { fetchProviders } from '../../../../store/domain/provider/actions';
import SelectDate from './TimeForm';


class DashboardView extends Component {

  componentWillMount() {
    const {
      user,
      routeParams,
    } = this.props;
    this.setState({
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    });
    this.props.fetchReports(user.id, routeParams.installationId,
      routeParams.providerId, moment().subtract(1, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    this.fetchLastDataPoint(this.props);
    this.props.fetchProviders(user.id);
    this.installationId = routeParams.installationId;
    this.providerId = routeParams.providerId;
    this.setState({ selectedIndex: 0 });
    this.selectDownstream = this.selectDownstream.bind(this);
    this.selectUpstream = this.selectUpstream.bind(this);
    this.selectGeneral = this.selectGeneral.bind(this);
    this.showLastMonthOfData = this.showLastMonthOfData.bind(this);
    this.selectDates = this.selectDates.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.installationId !== nextProps.routeParams.installationId
         || this.providerId !== nextProps.routeParams.providerId) {
      this.providerId = nextProps.routeParams.providerId;
      this.installationId = nextProps.routeParams.installationId;
      let startDate = this.state.startDate;
      let endDate   = this.state.endDate;
      if (startDate !== null && typeof startDate !== "string") {
        startDate = this.state.startDate.format('YYYY-MM-DD');
        endDate   = this.state.endDate.format('YYYY-MM-DD');
      }
      nextProps.fetchReports(nextProps.user.id, nextProps.routeParams.installationId,
        nextProps.routeParams.providerId, startDate, endDate);
      this.fetchLastDataPoint(nextProps);
      this.setState({ selectedIndex: 0 });
    }
    if (nextProps.reports) {
      this.setData(nextProps.reports, 0);
    }
  }

  fetchLastDataPoint(props) {
    const {
      user,
      routeParams,
    } = props;
    props.fetchLastReportDate(user.id, routeParams.installationId,
      routeParams.providerId, moment().format('YYYY-MM-DD'));
  }

  setData(reports, mode) {
    this.fechas = reports.dates;
    this.data = [];
    if (mode === 0 || mode === 1) {
      this.data.push({
        data: reports.upUsage,
        name: 'Utilización up',
      }, {
        data: reports.upQuality,
        name: 'Calidad up',
      });
    } else {
      this.data.push({name:' '}, {name:' '});
    }
    if (!(mode === 0 || mode === 2)) {
      this.data.push({name:' '}, {name:' '});
    } else {
      this.data.push({
        data: reports.downUsage,
        name: 'Utilización down',
      }, {
        data: reports.downQuality,
        name: 'Calidad down',
      });
    }
  }

  selectGeneral() {
    this.setData(this.props.reports, 0);
    this.setState({ selectedIndex:0 });
    this.forceUpdate();
  }

  selectUpstream() {
    this.setData(this.props.reports, 1);
    this.setState({ selectedIndex:1 });
    this.forceUpdate();
  }

  selectDownstream() {
    this.setData(this.props.reports, 2);
    this.setState({ selectedIndex:2 });
    this.forceUpdate();
  }

  showLastMonthOfData() {
    const lastDate = this.props.reports.lastDate;
    const {
      user,
      routeParams,
    } = this.props;
    if (lastDate) {
      const lastReportDate = moment(lastDate, "YYYY-MM-DDTHH:mm:ss.SSSSZ");
      const end = lastReportDate.format('YYYY-MM-DD');
      const start = lastReportDate.subtract(1, 'month').format('YYYY-MM-DD');
      this.setState({
        startDate: start,
        endDate: end,
      });
      this.props.fetchReports(user.id, routeParams.installationId,
        routeParams.providerId, start, end);
    } else {
      this.fetchLastDataPoint(this.props);
    }
  }

  selectDates(dates) {
    const {
      user,
      routeParams,
    } = this.props;
    this.setState({
      startDate: moment(dates.startDate).format('YYYY-MM-DD'),
      endDate: moment(dates.endDate).format('YYYY-MM-DD'),
    });
    this.props.fetchReports(user.id, routeParams.installationId, routeParams.providerId,
      moment(dates.startDate).format('YYYY-MM-DD'), moment(dates.endDate).format('YYYY-MM-DD'));
  }

  changeDate(dates) {
    this.selectDates(dates);
  }

  getProviderName(providerId) {
    if (providerId === '0') return 'General';
    const providerName = this.props.providers[providerId];
    if (providerName) return providerName.name;
    return '';
  }

  render() {
    return (
      <div>
        <SelectDate
          onSubmit={this.showLastMonthOfData}
          onChange={this.changeDate}
          start={moment(this.props.reports.lastDate, 'YYYY-MM-DD').subtract(1, 'month').toDate()}
          end={  moment(this.props.reports.lastDate, 'YYYY-MM-DD').toDate()}
        />
        <Paper style={{ marginTop: '15px' }}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label='General'
              icon={<BothArrow />}
              onTouchTap={this.selectGeneral}
            />
            <BottomNavigationItem
              label='Upstream'
              icon={<TopArrow />}
              onTouchTap={this.selectUpstream}
            />
            <BottomNavigationItem
              label='Downstream'
              icon={<BottomArrow />}
              onTouchTap={this.selectDownstream}
            />
          </BottomNavigation>
        </Paper>
        <DashboardChart
          isp={this.getProviderName(this.props.routeParams.providerId)}
          email={this.props.user.username}
          fechas={this.fechas}
          data={this.data}
        />
      </div>
    );
  }
}

DashboardView.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }),
  routeParams: PropTypes.shape({
    installationId: PropTypes.string,
    providerId: PropTypes.string,
  }),
  fetchReports: PropTypes.func,
  fetchProviders: PropTypes.func,
  fetchLastReportDate: PropTypes.func,
  providers: PropTypes.shape({
    name: PropTypes.string,
  }),
  reports: PropTypes.shape({
    upUsage: PropTypes.array,
    downUsage: PropTypes.array,
    upQuality: PropTypes.array,
    downQuality: PropTypes.array,
    lastDate: PropTypes.string,
  }),
};

const mapStateToProps = (store) => ({
  user: store.account.user,
  reports: R.pathOr({}, ['reports'], store),
  providers: store.providers,
});

const mapDispatchToProps = dispatch => ({
  fetchReports: (userId, installationId, providerId, startDate, endDate) =>
    dispatch(fetchReports(userId, installationId, providerId, startDate, endDate)),
  fetchProviders: userId =>
    dispatch(fetchProviders(userId)),
  fetchLastReportDate: (userId, installationId, providerId, endDate) =>
    dispatch(fetchLastReportDate(userId, installationId, providerId, endDate)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardView);
