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
  Spacer,
  Divider,
  Switch,
  Box,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { FormikConfig, useFormik } from "formik";
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
  const [estVolatility, setEstVolatility] = useState(0);

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
        setEstVolatility(res.data.volatility);
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
    <Stack
      w="full"
      h="full"
      overflowY="scroll"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: "24px",
        },
      }}
    >
      <FormControl>
        <VStack align="left" spacing={4}>
          <Box>
            <FormLabel>Token</FormLabel>
            <Select value={tokens[tokenInd]} onChange={onTokenChange}>
              {tokens.map((token, i) => (
                <option key={i} value={token}>
                  {token}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <FormLabel>Candlestick interval</FormLabel>
            <RadioGroup
              options={timeIntervals}
              value={timeInterval}
              onChange={() => null}
            />
          </Box>
          <Box>
            <FormLabel>Lookback (days)</FormLabel>
            <RadioGroup
              options={lookbacks}
              value={lookback}
              onChange={onLookbackChange}
            />
          </Box>
          <Divider />
          <Box>
            <FormLabel>Volatility</FormLabel>
            <RadioGroup
              options={volatilityAlgos}
              value={vAlgo}
              onChange={setVAlgo}
            />
            <Text as="i" fontSize="sm" color="grey">
              Estimated Volatility:{" "}
              {isCalculating ? "Calculating" : estVolatility * 100}%
            </Text>
            <NumberInput
              mt={2}
              value={formik.values.volatility * 100}
              onChange={(val) =>
                formik.setFieldValue("volatility", parseFloat(val) / 100)
              }
            >
              <NumberInputField />
            </NumberInput>
          </Box>
          <Box>
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
          </Box>
          <Box>
            <FormLabel>Days till maturity</FormLabel>
            <NumberInput
              value={formik.values.maturity}
              onChange={(val) => formik.setFieldValue("maturity", val)}
            >
              <NumberInputField />
            </NumberInput>
          </Box>

          <HStack w="100%" spacing={2} align="center">
            <FormLabel mb={0}>Calculate Spread</FormLabel>
            <Switch
              isChecked={formik.values.isSpread}
              onChange={() =>
                formik.setFieldValue("isSpread", !formik.values.isSpread)
              }
            />
          </HStack>

          {formik.values.isSpread ? (
            <Box>
              <FormLabel>Buy Strike / Sell Strike</FormLabel>
              <HStack w="100%" spacing={10} align="center">
                <NumberInput
                  value={formik.values.buyStrike}
                  onChange={(val) => formik.setFieldValue("buyStrike", val)}
                >
                  <NumberInputField />
                </NumberInput>
                <Text>/</Text>
                <NumberInput
                  value={formik.values.sellStrike}
                  onChange={(val) => formik.setFieldValue("sellStrike", val)}
                >
                  <NumberInputField />
                </NumberInput>
              </HStack>
            </Box>
          ) : (
            <Box>
              <FormLabel>Strike range</FormLabel>
              <HStack w="100%" spacing={10} align="center">
                <NumberInput
                  value={formik.values.minStrike}
                  onChange={(val) => formik.setFieldValue("minStrike", val)}
                >
                  <NumberInputField />
                </NumberInput>
                <Text>-</Text>
                <NumberInput
                  value={formik.values.maxStrike}
                  onChange={(val) => formik.setFieldValue("maxStrike", val)}
                >
                  <NumberInputField />
                </NumberInput>
              </HStack>
            </Box>
          )}

          <Button onClick={() => formik.handleSubmit()}>Calculate</Button>
        </VStack>
      </FormControl>
    </Stack>
  );
};

export default OptionForm;
