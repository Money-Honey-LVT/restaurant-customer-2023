import { LoadingOverlay } from '@mantine/core';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ROUTER from '../config/router';
import AppLayout from '../layouts/AppLayout';

const _404NotFound = React.lazy(() => import('../components/common/_404NotFound'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path={ROUTER.AUTH.LOGIN}
        element={
          <Suspense fallback={<LoadingOverlay visible />}>
            <>login</>
          </Suspense>
        }
      />

      <Route
        path={ROUTER.AUTH.REGISTER}
        element={
          <Suspense fallback={<LoadingOverlay visible />}>
            <>register</>
          </Suspense>
        }
      />

      <Route path={ROUTER.HOME.INDEX} element={<AppLayout />}>
        <Route path={ROUTER.HOME.INDEX} element={<>home</>} />
        <Route path="*" element={<_404NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
