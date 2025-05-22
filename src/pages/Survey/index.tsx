import React from "react";
import { useGetAllSurveysQuery } from "../../redux/apis/surveysApi";

const Survey: React.FC = () => {
  const { data: surveys = [], isLoading, error } = useGetAllSurveysQuery();
  console.log({ surveys, isLoading, error });

  return (
    <div>
      <h1>Survey Results</h1>
      {/* Add survey content here */}
    </div>
  );
};

export default Survey;
