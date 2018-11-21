import AdminView from './components/Admin';
import IspCharts from './IspCharts/index';
import UserAdminView from './UserAdminView/index';

// Sync route definition
export default () => ({
  path: 'admin',
  component : AdminView,
  childRoutes: [
    IspCharts(),
    UserAdminView(),
  ],
});
