import { IData } from "../../types";
import { useGetApplicantIndividualCompanyRelationsQuery, useGetApplicantIndividualCompanyPositionsQuery } from "../generated/graphql";

const useGetData = () => {
  const { data: relationsData, loading: loadingRelations, error: errorRelations } = useGetApplicantIndividualCompanyRelationsQuery();
  const { data: positionsData, loading: loadingPositions, error: errorPositions } = useGetApplicantIndividualCompanyPositionsQuery();

  return {
    relations: relationsData?.applicantIndividualCompanyRelations?.data as IData[],
    positions: positionsData?.applicantIndividualCompanyPositions?.data as IData[],
    loading: loadingRelations || loadingPositions,
    error: errorRelations || errorPositions,
  };
}

export default useGetData;