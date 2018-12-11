import React, { Component } from 'react';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Pencil from 'material-ui/svg-icons/content/create';
import Wrench from 'material-ui/svg-icons/action/build';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import LocationListView from './LocationList';
import './Sidebar.scss';

const SelectableList = makeSelectable(List);

class SidebarView extends Component {

  renderInstallations(installations, setActiveInstallation) {
    if (!installations.list) return [];
    return Object.keys(installations.list).map((key) => {
      const installation = installations.list[key];
      return (
        <LocationListView
          installation={installation}
          key={installation.id}
          active={installations.activeInstallation === installation.id}
          activeLocation={installations.activeLocation}
          setActiveInstallation={setActiveInstallation}
        />
      );
    });
  }

  renderAdminLink(user) {
    if (user.role === 'admin') {
      return (
        <div>
          <Subheader>Administración</Subheader>
          <ListItem
            key='admin'
            primaryText={'Panel de administración'}
            containerElement={<Link to='/home/admin/users' />}
            value='/home/admin/users'
            open={true}
            nestedItems={[
              <ListItem
                key='admin0'
                primaryText={'Gráficos de utilización'}
                containerElement={<Link to='/home/admin/ispchart' />}
                  value='/home/admin/ispchart'
              />,
            ]}
          />
        </div>
      );
    }
    return <div />;
  }

  render() {
    const {
      installations,
      user,
      setActiveInstallation,
      downloadAdminReport,
      location
    } = this.props;
    return (
      <div>
        <SelectableList
          value={location.pathname} >
          <Subheader>Instalaciones</Subheader>
          {this.renderInstallations(installations, setActiveInstallation)}
          <Divider />
        </SelectableList>

        <Subheader>Configuración</Subheader>
        <ListItem
          key='config0'
          primaryText={'Ver instalaciones'}
          leftIcon={<Pencil />}
          containerElement={<Link to='/home/installation/view' />}
          value='/home/installation/view'
          />
        <ListItem
          key='config1'
          primaryText={'Mi cuenta'}
          leftIcon={<Wrench />}
          containerElement={<Link to='/home/account' />}
          value='/home/account'
        />
        <ListItem
          key='config2'
          primaryText={'Reporte de usuario'}
          leftIcon={<Pencil />}
          containerElement={<Link to='/home/userreport' />}
          value='/home/userreport'
        />
        <Divider />

        {this.renderAdminLink(user, downloadAdminReport)}
      </div>
    );
  }
}

SidebarView.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }),
  installations: PropTypes.shape({
    list: PropTypes.object,
    activeInstallation: PropTypes.number,
    activeLocation: PropTypes.number,
  }),
  setActiveInstallation: PropTypes.func,
  downloadAdminReport: PropTypes.func,
};


export default SidebarView;
