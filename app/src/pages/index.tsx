import { useEffect, useState } from "react";
import { Heading, HStack, useToast, VStack } from "@chakra-ui/react";
import OptionForm from "@/components/Input/OptionForm";
import Layout from "@/components/Layout/Layout";
import GreeksTable from "@/components/Table/GreeksTable";
import { OptionData, PriceData } from "@/types/price";
import PriceChart from "@/components/Charts/PriceChart";
import { fetchPrices, fetchTokens } from "@/utils/api";

const Home = () => {
  const lookbacks = ["1", "7", "14", "30", "60", "90"];

  const [tokens, setTokens] = useState<string[]>(["solana"]);
  const [tokenInd, setTokenInd] = useState(0);
  const [lookback, setLookback] = useState(lookbacks[0]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [optionData, setOptionData] = useState<Array<[OptionData, OptionData]>>(
    []
  );

  const toast = useToast();

  const formValues = {
    lookback: lookbacks[0],
    volatility: 10,
    interestRates: 0,
    maturity: 7,
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
    fetchPrices(tokens[tokenInd], parseInt(lookback))
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

  return (
    <Layout>
      <VStack spacing={8}>
        <Heading>Options Pricing Calculator</Heading>
        <HStack spacing={4} width="100%">
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
            onSubmit={console.log}
          />
          <PriceChart token={tokens[tokenInd]} data={priceData} />
        </HStack>
        <GreeksTable data={optionData} />
      </VStack>
    </Layout>
  );
};

export default Home;
