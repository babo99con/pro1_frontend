import { Box, Container, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          환영합니다!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          
        </Typography>
      </Container>
    </Box>
  );
}
