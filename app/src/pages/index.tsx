import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  useToast,
  VStack,
  Text,
  Container,
  Spacer,
} from "@chakra-ui/react";
import OptionForm from "@/components/Input/OptionForm";
import Layout from "@/components/Layout/Layout";
import GreeksTable from "@/components/Table/GreeksTable";
import { OptionData, PriceData, SpreadOptionData } from "@/types/price";
import PriceChart from "@/components/Charts/PriceChart";
import { fetchPrices, fetchPricesCached, fetchTokens } from "@/utils/api";
import { OptionFormData } from "@/types/form";
import axios from "axios";
import { calcPriceStep, latestPrice } from "@/utils/math";
import SpreadGreeksTable from "@/components/Table/SpreadGreeksTable";

const Home = () => {
  const lookbacks = ["1", "7", "14", "30", "60", "90"];

  const [tokens, setTokens] = useState<string[]>(["solana"]);
  const [tokenInd, setTokenInd] = useState(0);
  const [lookback, setLookback] = useState(lookbacks[0]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [optionData, setOptionData] = useState<OptionData[]>([]);
  const [isSpread, setIsSpread] = useState(false);
  const [spreadOptionData, setSpreadOptionData] =
    useState<SpreadOptionData | null>(null);

  const toast = useToast();

  const formValues = {
    lookback: lookbacks[0],
    volatility: 10,
    interestRate: 0,
    maturity: 7,
    isSpread: false,
  };

  // Initialise data
  useEffect(() => {
    fetchTokens("solana-ecosystem")
      .then((data) => setTokens(data))
      .catch((e) => {
        toast({
          title: "failed to fetch tokens",
          description: e.toString(),
          status: "error",
          position: "top-right",
          isClosable: true,
        });
        setTokens(["solana"]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  // Update graph on token change
  useEffect(() => {
    fetchPricesCached(tokens[tokenInd], parseInt(lookback))
      .then((data) => setPriceData(data))
      .catch((e) => {
        toast({
          title: "failed to fetch prices",
          description: e.toString(),
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      });
  }, [tokens, tokenInd, toast, lookback]);

  const handleFormSubmit = (values: OptionFormData) => {
    setIsSpread(values.isSpread);
    if (!values.isSpread) {
      const payload = {
        token: tokens[tokenInd],
        num_rows: 10,
        expiry: values.maturity,
        volatility: values.volatility,
        interest_rate: values.interestRate,
        min_strike: values.minStrike,
        max_strike: values.maxStrike,
      };
      axios
        .get("/api/bs", { params: payload })
        .then((res) => {
          setOptionData(res.data);
        })
        .catch((e) => {
          toast({
            title: "failed to fetch option data",
            description: e.toString(),
            status: "error",
            position: "top-right",
            isClosable: true,
          });
        });
    } else {
      const payload = {
        token: tokens[tokenInd],
        num_rows: 10,
        expiry: values.maturity,
        volatility: values.volatility,
        interest_rate: values.interestRate,
        buy_strike: values.buyStrike,
        sell_strike: values.sellStrike,
      };
      axios
        .get("/api/bs_spread", { params: payload })
        .then((res) => {
          setSpreadOptionData(res.data);
        })
        .catch((e) => {
          toast({
            title: "failed to fetch spread option data",
            description: e.toString(),
            status: "error",
            position: "top-right",
            isClosable: true,
          });
        });
    }
  };

  return (
    <Layout>
      <Box
        bg="white"
        borderRight="1px"
        borderRightColor="gray.200"
        w={{ base: "full", md: 450 }}
        pos="fixed"
        h="100vh"
        px={10}
      >
        <Flex h="full" direction="column">
          <Flex
            h={20}
            alignItems="center"
            justifyContent="space-between"
            w="100%"
          >
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
              Options Pricing Calculator
            </Text>
            {/* <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} /> */}
          </Flex>
          <OptionForm
            tokens={tokens}
            lookbacks={lookbacks}
            lookback={lookback}
            onLookbackChange={setLookback}
            tokenInd={tokenInd}
            onTokenChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setTokenInd(e.target.selectedIndex)
            }
            defaultValues={formValues}
            onSubmit={handleFormSubmit}
          />
        </Flex>
      </Box>

      <VStack ml={{ base: 0, md: 450 }} p={10} spacing={5}>
        <PriceChart token={tokens[tokenInd]} data={priceData} />
        <Spacer />
        {isSpread ? (
          <SpreadGreeksTable data={spreadOptionData} />
        ) : (
          <GreeksTable data={optionData} />
        )}
      </VStack>
    </Layout>
  );
};

export default Home;
