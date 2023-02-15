import { useEffect, useState } from "react";
import { Heading, HStack, VStack } from "@chakra-ui/react";
import OptionForm from "@/components/Input/OptionForm";
import Layout from "@/components/Layout/Layout";
import GreeksTable from "@/components/Table/GreeksTable";
import { OptionData, PriceData } from "@/types/price";
import PriceChart from "@/components/Charts/PriceChart";

export default function Home() {
  const [tokens, setTokens] = useState(["sol"]);
  const [tokenInd, setTokenInd] = useState(0);

  const priceData: PriceData[] = [];
  const optionData: Array<[OptionData, OptionData]> = [];

  useEffect(() => {}, [tokens]);

  return (
    <Layout>
      <VStack>
        <Heading>Options Pricing Calculator</Heading>
        <HStack>
          <OptionForm
            tokens={tokens}
            tokenInd={tokenInd}
            onTokenChange={(e) => setTokenInd(e.target.value)}
          />
          <PriceChart token={tokens[tokenInd]} data={priceData} />
        </HStack>
        <GreeksTable data={optionData} />
      </VStack>
    </Layout>
  );
}
