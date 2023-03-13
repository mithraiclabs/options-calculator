import { Box, Container } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box minH="100vh" bg="white">
      {children}
    </Box>
  );
};

export default Layout;
