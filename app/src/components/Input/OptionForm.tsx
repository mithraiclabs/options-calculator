import React, { useEffect, useState } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import ExpirationInput from "./Expiration";

interface OptionFormProps {
  tokens: string[];
  tokenInd: number;
  onTokenChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const OptionForm: React.FC<OptionFormProps> = ({
  tokens,
  tokenInd,
  onTokenChange,
}) => {
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  return (
    <Container p={10}>
      <FormControl>
        <VStack align="left">
          <Select value={tokens[tokenInd]} onChange={onTokenChange}>
            {tokens.map((token, i) => (
              <option key={i} value={token}>
                {token}
              </option>
            ))}
          </Select>
          <FormLabel>Volatility</FormLabel>
          <NumberInput>
            <NumberInputField value={10} />
          </NumberInput>
          <FormLabel>Interest rate</FormLabel>
          <NumberInput>
            <NumberInputField value={1} />
          </NumberInput>
          <FormLabel>Days till maturity</FormLabel>
          <ExpirationInput />
        </VStack>
      </FormControl>
    </Container>
  );
};

export default OptionForm;
