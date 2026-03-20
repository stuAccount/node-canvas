import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

const HomePage = lazy(async () => {
  const module = await import("../../pages/home/HomePage");

  return {
    default: module.HomePage,
  };
});

const PlayPage = lazy(async () => {
  const module = await import("../../pages/play/PlayPage");

  return {
    default: module.PlayPage,
  };
});

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/play/:id",
    element: <PlayPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
