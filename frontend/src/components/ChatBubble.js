import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

const StyledBubble = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '80%',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 0,
    height: 0,
    border: '10px solid transparent',
    borderTopColor: theme.palette.primary.main,
    borderBottom: '0',
    borderLeft: '0',
    marginBottom: '-20px',
    transform: 'translateX(-50%)',
  },
}));

export default function ChatBubble({ text }) {
  return (
    <StyledBubble elevation={3}>
      <Typography
        variant="body1"
        style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowY: 'auto',
            maxHeight: '150px'
        }}>
            {text}
        </Typography>
    </StyledBubble>
  );
}
