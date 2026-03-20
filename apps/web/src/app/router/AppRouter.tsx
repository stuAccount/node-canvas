import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { appRoutes } from "./routes";

const RoutedApp = () => useRoutes(appRoutes);

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={28} color="inherit" />
        </Box>
      }
    >
      <RoutedApp />
    </Suspense>
  </BrowserRouter>
);
