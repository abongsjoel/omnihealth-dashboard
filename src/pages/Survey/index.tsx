import React from "react";

import { useGetAllSurveysQuery } from "../../redux/apis/surveysApi";
import Table from "../../components/common/Table";
import type { SurveyEntry } from "../../utils/types";

import "./Survey.scss";

const Survey: React.FC = () => {
  const { data: surveys = [], isLoading, error } = useGetAllSurveysQuery();

  const data = surveys.filter((s) => s.userId !== "WEB_SIMULATION");

  const config = [
    {
      label: "Phone Number",
      render: (survey: SurveyEntry) => survey.userId,
      size: "14px",
    },
    {
      label: "Age",
      render: (survey: SurveyEntry) => survey.age,
      size: "4px",
    },
    {
      label: "Gender",
      render: (survey: SurveyEntry) => survey.gender,
      size: "7px",
    },
    {
      label: "Conditions",
      render: (survey: SurveyEntry) => (
        <span>{survey.conditions.join(", ")}</span>
      ),
      size: "10px",
    },
    {
      label: "Duration",
      render: (survey: SurveyEntry) => survey.duration,
      size: "14px",
    },
    {
      label: "Participant",
      render: (survey: SurveyEntry) => survey.caregiver,
      size: "7px",
    },
    {
      label: "Providers Involved",
      render: (survey: SurveyEntry) => survey.provider,
      size: "10px",
    },
    {
      label: "Received Advice",
      render: (survey: SurveyEntry) => survey.advice,
      size: "10px",
    },
    {
      label: "Advice Understood",
      render: (survey: SurveyEntry) => survey.advice_understood,
      size: "10px",
    },
    {
      label: "Treatment Explained",
      render: (survey: SurveyEntry) => survey.treatment_explained,
      size: "10px",
    },
    {
      label: "Hospital Visit",
      render: (survey: SurveyEntry) => survey.clinic_visit,
      size: "15px",
    },
    {
      label: "Challenges",
      render: (survey: SurveyEntry) => survey.challenge,
      size: "10px",
    },
    {
      label: "Care Unit",
      render: (survey: SurveyEntry) => survey.receive_care,
      size: "10px",
    },
    {
      label: "Service Interest",
      render: (survey: SurveyEntry) => survey.interested,
      size: "10px",
    },
  ];

  const keyFn = (survey: SurveyEntry) => {
    return survey._id;
  };

  /* Improve subsequently with better loading and error states */

  return (
    <div className="survey_container">
      <h1 className="title">Survey Results</h1>
      {isLoading ? (
        <p>Loading survey results...</p>
      ) : error ? (
        <p>Error loading survey results.</p>
      ) : data.length === 0 ? (
        <p>No survey results found.</p>
      ) : (
        <Table data={data} config={config} keyFn={keyFn} />
      )}
    </div>
  );
};

export default Survey;
