import { Box, useRadio, UseRadioProps } from "@chakra-ui/react";

interface RadioButtonProps extends UseRadioProps {
  children: React.ReactNode;
}

const RadioButton = (props: RadioButtonProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" w="100%">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "red.300",
          color: "white",
          borderColor: "red.300",
        }}
        _hover={{
          bg: "red.100",
          color: "black",
          borderColor: "red.100",
        }}
        px={5}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default RadioButton;
