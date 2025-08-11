'use strict';

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function StatCard({ title, value, subtitle }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}