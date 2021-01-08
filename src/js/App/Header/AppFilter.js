import React, { useState, useEffect } from 'react';
import { safeLoad } from 'js-yaml';
import {
  Button,
  CaretDownIcon,
  Dropdown,
  DropdownToggle,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  SearchInput,
  Split,
  SplitItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { CogIcon, FilterIcon } from '@patternfly/react-icons';

import ansible from '../../../../static/images/platform-icons/ansible.svg';
import openshift from '../../../../static/images/platform-icons/openshift.svg';
import costManagement from '../../../../static/images/platform-icons/cost-management.svg';
import migrationsNamespace from '../../../../static/images/platform-icons/migrations-namespace.svg';
import { getNavFromConfig } from '../../nav/globalNav';
import sourceOfTruth from '../../nav/sourceOfTruth';
import './AppFilter.scss';

const getIcon = (id) =>
  ({
    insights: <img src={`${insights.chrome.isBeta() ? '/beta' : ''}/apps/landing/fonts/Insights.svg`} alt="Insights Logo" />,
    openshift: <img src={openshift} alt="Openshift Logo" />,
    SAP: <img src={`${insights.chrome.isBeta() ? '/beta' : ''}/apps/landing/fonts/SAP.svg`} alt="SAP Logo" />,
    'cost-management': <img src={costManagement} alt="Cost Management Logo" />,
    migrations: <img src={migrationsNamespace} alt="Migration Services Logo" />,
    ansible: <img src={ansible} alt="Automation Logo" />,
    settings: <CogIcon className="icon-gray" />,
    subscriptions: <img src={`${insights.chrome.isBeta() ? '/beta' : ''}/apps/landing/fonts/Subscriptions.svg`} alt="Subscriptions Logo" />,
  }[id]);

const appIds = ['insights', 'openshift', 'cost-management', 'migrations', 'subscriptions', 'ansible', 'settings'];

const AppFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);

  useEffect(() => {
    (async () => {
      const navigationYml = await sourceOfTruth();
      const appData = await getNavFromConfig(safeLoad(navigationYml), undefined);
      setApps(appIds.map((id) => appData[id]));
      setFilteredApps(appIds.map((id) => appData[id]));
    })();
  }, []);

  useEffect(() => {
    setFilteredApps(
      apps.filter((app) =>
        app?.routes?.some((subApp) => subApp.title.toLowerCase().includes(filterValue.toLowerCase()))
          ? { ...app, routes: app.routes.filter((subApp) => subApp.title.toLowerCase().includes(filterValue.toLowerCase())) }
          : false
      )
    );
  }, [filterValue]);

  const renderApp = (app) => (
    <div className="galleryItem">
      {
        <React.Fragment>
          <Split>
            <SplitItem>{getIcon(app.id)}</SplitItem>
            <SplitItem>
              <TextContent>
                <Text component="h4">{app.title}</Text>
                {app.routes.map((subApp) => (
                  <Text component="p" key={`${app.id}/${subApp.id}`}>
                    <Text component="a" href={`${app.id}/${subApp.id}`}>
                      {subApp.title}
                    </Text>
                  </Text>
                ))}
              </TextContent>
            </SplitItem>
          </Split>
        </React.Fragment>
      }
    </div>
  );

  return (
    <Dropdown
      className="ins-c-page__app-filter-dropdown"
      isPlain
      onSelect={() => setIsOpen(true)}
      toggle={
        <DropdownToggle id="toggle-id" onToggle={() => setIsOpen(!isOpen)} toggleIndicator={CaretDownIcon}>
          All apps and services
        </DropdownToggle>
      }
      isOpen={isOpen}
      ouiaId="App Filter"
    >
      <div className="content">
        <SearchInput
          placeholder="Find application or service"
          value={filterValue}
          onChange={(val) => setFilterValue(val)}
          onClear={() => setFilterValue('')}
        />
        {filteredApps?.length > 0 ? (
          <div className="gallery">{filteredApps.map((app) => renderApp(app))}</div>
        ) : (
          <EmptyState className="pf-u-mt-xl" variant={EmptyStateVariant.full}>
            <EmptyStateIcon className="pf-u-mb-xl" icon={FilterIcon} />
            <Title headingLevel="h4">No matching applications or services found.</Title>
            <EmptyStateBody className="pf-u-mb-xl">
              This filter criteria matches no applications or services. Try changing your input filter.
            </EmptyStateBody>
            <Button className="pf-u-mt-lg" variant="link" onClick={() => setFilterValue('')}>
              Clear all filters
            </Button>
          </EmptyState>
        )}
      </div>
    </Dropdown>
  );
};

export default AppFilter;

AppFilter.propTypes = {};
