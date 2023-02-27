import React, { useEffect, useState } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
  VStack,
  Text,
  useToast,
  Button,
} from "@chakra-ui/react";
import { FormikConfig, useFormik } from "formik";
import ExpirationInput from "./Expiration";
import RadioGroup from "./RadioGroup";
import axios from "axios";
import { OptionFormData } from "@/types/form";
import { getLatestInterestYields } from "@/utils/firestore";

interface OptionFormProps {
  tokens: string[];
  lookbacks: string[];
  lookback: string;
  onLookbackChange: (val: string) => void;
  tokenInd: number;
  onTokenChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValues: OptionFormData;
  onSubmit: FormikConfig<OptionFormData>["onSubmit"];
}

const OptionForm: React.FC<OptionFormProps> = ({
  tokens,
  lookbacks,
  lookback,
  onLookbackChange,
  tokenInd,
  onTokenChange,
  defaultValues,
  onSubmit,
}) => {
  const timeIntervals = ["30min", "4h", "4d"];
  const volatilityAlgos = ["std_dev", "yang_zhang"];
  const [timeInterval, setTimeInterval] = useState(timeIntervals[0]);
  const [interestDate, setInterestDate] = useState<string>("");
  const [vAlgo, setVAlgo] = useState(volatilityAlgos[0]);
  const [isCalculating, setIsCalculating] = useState(false);

  const toast = useToast();
  const formik = useFormik<OptionFormData>({
    initialValues: defaultValues,
    onSubmit: onSubmit,
  });

  useEffect(() => {
    getLatestInterestYields()
      .then((data) => {
        // @ts-ignore
        formik.setFieldValue("interestRate", parseFloat(data["1 YR"]) / 100);
        setInterestDate(data.id);
      })
      .catch((e) => {
        toast({
          title: "failed to fetch interest rates",
          description: e.toString(),
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set time intervals
    const lb = parseInt(lookback);
    if (lb <= 2) {
      setTimeInterval("30min");
    } else if (lb <= 14) {
      setTimeInterval("4h");
    } else {
      setTimeInterval("4d");
    }

    // fetch volatility
    setIsCalculating(true);
    axios
      .get(`/api/volatility`, {
        params: {
          algorithm: vAlgo,
          token: tokens[tokenInd],
          lookback: lookback,
        },
      })
      .then((res) => {
        formik.setFieldValue("volatility", res.data.volatility);
        setIsCalculating(false);
      })
      .catch((e) => {
        toast({
          title: "failed to fetch volatility",
          description: e.toString(),
          status: "error",
          position: "top-right",
          isClosable: true,
        });
        setIsCalculating(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vAlgo, lookback, tokenInd]);

  return (
    <Container p={10} w={800}>
      <FormControl>
        <VStack align="left">
          <FormLabel>Token</FormLabel>
          <Select value={tokens[tokenInd]} onChange={onTokenChange}>
            {tokens.map((token, i) => (
              <option key={i} value={token}>
                {token}
              </option>
            ))}
          </Select>
          <FormLabel>Candlestick interval</FormLabel>
          <RadioGroup
            options={timeIntervals}
            value={timeInterval}
            onChange={() => null}
          />
          <FormLabel>Lookback (days)</FormLabel>
          <RadioGroup
            options={lookbacks}
            value={lookback}
            onChange={onLookbackChange}
          />
          <FormLabel>Volatility algorithm</FormLabel>
          <RadioGroup
            options={volatilityAlgos}
            value={vAlgo}
            onChange={setVAlgo}
          />
          <Text as="i" fontSize="sm" color="grey">
            Estimated Volatility:{" "}
            {isCalculating ? "Calculating" : formik.values.volatility * 100}%
          </Text>
          <FormLabel>Interest rates</FormLabel>
          <NumberInput
            value={formik.values.interestRate * 100}
            isDisabled={true}
          >
            <NumberInputField />
            <Text as="i" fontSize="sm" color="grey">
              Retrieved from nasdaq {interestDate}
            </Text>
          </NumberInput>
          <FormLabel>Days till maturity</FormLabel>
          <ExpirationInput
            value={formik.values.maturity}
            onChange={(val) => formik.setFieldValue("maturity", val)}
          />
          <Button onClick={() => formik.handleSubmit()}>Calculate</Button>
        </VStack>
      </FormControl>
    </Container>
  );
};

export default OptionForm;
