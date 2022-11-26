import React, { useMemo } from 'react';
import { Breadcrumb } from '@chaoswise/ui';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

const breadcrumbNameMap = {};

function getBreadcrumbByRoutes(routes) {
  routes.forEach(item => {
    if(item.path) {
      breadcrumbNameMap[item.path] = item.name;
    }
    if(item.routes && item.routes.length > 0) {
      getBreadcrumbByRoutes(item.routes);
    }
  });
}

function BreadcrumbShow({
  route
}) {
  
  useMemo(() => {
    getBreadcrumbByRoutes(route.routes);
  }, [route]);
  

  const { location } = useHistory();

  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <div>
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
}

export default BreadcrumbShow;
