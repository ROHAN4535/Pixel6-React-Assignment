'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import EmployeeList from '../components/EmployeeList';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Home() {
  return (
    <Provider store={store}>
      <main>
        <EmployeeList />
      </main>
    </Provider>
  );
}