import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { BackToTop } from "../components/layout/SiteChrome";

const AboutPage = lazy(() => import("./AboutPage"));
const CafePage = lazy(() => import("./CafePage"));
const HomePage = lazy(() => import("./HomePage"));
const NotFound = lazy(() => import("./NotFound"));
const SearchPage = lazy(() => import("./SearchPage"));
const StatePage = lazy(() => import("./StatePage"));

function PageLoading() {
  return <main className="page-loading" aria-live="polite">LOADING</main>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/india/:stateSlug" element={<StatePage />} />
        <Route path="/cafe/:cafeSlug" element={<CafePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound kind="page" />} />
      </Routes>
      <BackToTop />
    </Suspense>
  );
}

export default AppRoutes;
