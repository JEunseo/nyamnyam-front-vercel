// App.tsx
import React from 'react';
import { SearchProvider } from './SearchContext';
import Search from './Search';
import Page from '../page';

const App: React.FC = () => {
  return (
    <SearchProvider>
      <Search />
      <Page />
    </SearchProvider>
  );
};

export default App;