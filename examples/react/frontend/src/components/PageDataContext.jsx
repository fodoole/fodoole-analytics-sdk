import React, { createContext, useContext, useState, useEffect } from 'react';

const PageDataContext = createContext();
const userDevicId = "dev";

export function usePageData() {
  return useContext(PageDataContext);
}

export function PageDataProvider({ children }) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    qeen
      .fetchQeenContent(userDevicId, "http://localhost:4000/contentconfig/config.json")
      .then((fetchedPageData) => {
        setPageData(fetchedPageData);
        qeen.initPageSession(fetchedPageData);
      })
      .catch((error) => {
        console.error(error);
        setPageData(null);
      })
  }, []);

  return (
    <PageDataContext.Provider value={{ pageData }}>
      {children}
    </PageDataContext.Provider>
  );
}
