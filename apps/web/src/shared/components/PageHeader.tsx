import { Box, Chip, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  badge?: string;
};

export const PageHeader = ({
  eyebrow,
  title,
  description,
  action,
  badge,
}: PageHeaderProps) => (
  <Stack
    direction={{ xs: "column", md: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", md: "flex-start" }}
    spacing={3}
  >
    <Stack spacing={1.5} maxWidth={760}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        {eyebrow ? (
          <Typography
            variant="overline"
            sx={{ letterSpacing: "0.18em", color: "text.secondary" }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        {badge ? (
          <Chip
            label={badge}
            size="small"
            sx={{
              borderRadius: 999,
              backgroundColor: "rgba(17, 61, 90, 0.1)",
              color: "primary.dark",
            }}
          />
        ) : null}
      </Stack>
      <Typography variant="h1">{title}</Typography>
      {description ? (
        <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 680 }}>
          {description}
        </Typography>
      ) : null}
    </Stack>
    {action ? <Box sx={{ alignSelf: { xs: "stretch", md: "flex-start" } }}>{action}</Box> : null}
  </Stack>
);

