import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type CenteredFeedbackProps = {
  title: string;
  body?: ReactNode;
  loading?: boolean;
};

export const CenteredFeedback = ({
  title,
  body,
  loading = false,
}: CenteredFeedbackProps) => (
  <Paper
    elevation={0}
    sx={{
      minHeight: 360,
      borderRadius: 6,
      border: "1px solid",
      borderColor: "divider",
      backgroundColor: "background.paper",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 4,
    }}
  >
    <Stack spacing={2} alignItems="center" textAlign="center" maxWidth={480}>
      {loading ? <CircularProgress size={28} color="inherit" /> : null}
      <Typography variant="h5">{title}</Typography>
      {body ? (
        <Box sx={{ color: "text.secondary", typography: "body1" }}>{body}</Box>
      ) : null}
    </Stack>
  </Paper>
);

