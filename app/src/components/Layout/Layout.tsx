import { Container } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Container maxW={"8xl"} mx={"auto"} py={10} px={20}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
