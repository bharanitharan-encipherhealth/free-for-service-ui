"use client";

import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Empty, Progress, Steps, Tooltip, Skeleton } from "antd";
import { formatDateTime } from "@/util/reusableFunction";
import { RootState } from "@/state";
import style from "./style.module.css";

const stageChartMap2: Record<string, string> = {
  FILE_UPLOAD: "File Upload",
  OCR: "OCR",
  SECTIONS_FILTER: "Sections Filter",
  DISEASE_FOUND: "Disease",
  HEALTH_METRICS_CALCULATED: "Health Metrics Found",
  VALID_DISEASE_SEPARATION: "Valid disease",
  MEAT_FOUND: "Meat",
  COMBINATION_CODES_FOUND: "Combination codes",
  RAF_SCORE_FOUND: "RAF Score",
  FINISHED: "Finished",
  DISEASE_FOUND_FAILED: "DISEASE_FOUND_FAILED",
  OCR_FAILED: "OCR_FAILED",
  SECTIONS_FILTER_FAILED: "SECTIONS_FILTER_FAILED",
  VALID_DISEASE_SEPARATION_FAILED: "VALID_DISEASE_SEPARATION_FAILED",
  COMBINATION_CODES_FOUND_FAILED: "COMBINATION_CODES_FOUND_FAILED",
  MEAT_FOUND_FAILED: "MEAT_FOUND_FAILED",
  RAF_SCORE_FOUND_FAILED: "RAF_SCORE_FOUND_FAILED",
  HEALTH_METRICS_CALCULATION_FAILED: "HEALTH_METRICS_CALCULATION_FAILED",
};

const errStages: Record<string, string> = {
  DISEASE_FOUND_FAILED: "DISEASE_FOUND_FAILED",
  OCR_FAILED: "OCR_FAILED",
  VALID_DISEASE_SEPARATION_FAILED: "VALID_DISEASE_SEPARATION_FAILED",
  COMBINATION_CODES_FOUND_FAILED: "COMBINATION_CODES_FOUND_FAILED",
  MEAT_FOUND_FAILED: "MEAT_FOUND_FAILED",
  RAF_SCORE_FOUND_FAILED: "RAF_SCORE_FOUND_FAILED",
  HEALTH_METRICS_CALCULATION_FAILED: "HEALTH_METRICS_CALCULATION_FAILED",
};

const stageChartMap: Record<string, number> = {
  FILE_UPLOAD: 0,
  OCR: 1,
  OCR_FAILED: 1,
  SECTIONS_FILTER: 1.5,
  DISEASE_FOUND: 2,
  DISEASE_FOUND_FAILED: 2,
  HEALTH_METRICS_CALCULATED: 3,
  HEALTH_METRICS_CALCULATION_FAILED: 3,
  VALID_DISEASE_SEPARATION: 4,
  VALID_DISEASE_SEPARATION_FAILED: 4,
  MEAT_FOUND_FAILED: 5,
  MEAT_FOUND: 5,
  COMBINATION_CODES_FOUND: 6,
  COMBINATION_CODES_FOUND_FAILED: 6,
  RAF_SCORE_FOUND: 7,
  RAF_SCORE_FOUND_FAILED: 7,
  FINISHED: 8,
};

const tooltipText = ({ title }: { title: string }) => {
  switch (title) {
    case "file upload": return "EMR";
    case "ocr": return "Pre Processing";
    case "sections filter": return "Disease";
    case "raf score found": return "Combination Codes Found";
    default: return title;
  }
};

const mapState = (state: any) => ({
  fileProcessingData: state.tinDetailsReducer.fileProcessingReducer.allProcessing,
  webSocketData: state.webSocketReducer.webSocketDetails?.data,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const FileProcessingTable: React.FC<PropsFromRedux> = ({
  fileProcessingData,
  webSocketData,
}) => {
  console.log("FileProcessingTable data:", fileProcessingData);
  const patinetListAll = fileProcessingData?.data?.response || [];
  const [count, setCount] = useState(0);
  const [stepperStyle, setStepperStyle] = useState("flex");
  const [localData, setLocalData] = useState<any[]>([]);

  useEffect(() => {
    if (patinetListAll) {
      setLocalData(JSON.parse(JSON.stringify(patinetListAll)));
    }
  }, [patinetListAll]);

  useEffect(() => {
    if (webSocketData && webSocketData?.webSocketType === "PROCESS_STAGE") {
      setLocalData(prev => {
        const newData = [...prev];
        const foundItem = newData.find(x => x.patientId === webSocketData.patientId);
        if (foundItem) {
          foundItem.processStageChart = webSocketData?.processStageChart;
          if (webSocketData?.createdDate) {
            foundItem.processStageEventDTOs = [
              ...(foundItem.processStageEventDTOs || []),
              webSocketData
            ];
          }
        }
        return newData;
      });
    }
  }, [webSocketData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev + 5) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setStepperStyle(window.innerWidth <= 1229 ? "block" : "flex");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderUploadStatus = (data: any) => {
    let uploadStatus = 0;
    const stage = data?.processStageChart;

    switch (stage) {
      case "FILE_UPLOAD": uploadStatus = 5; break;
      case "OCR": uploadStatus = 20; break;
      case "OCR_FAILED": uploadStatus = 10; break;
      case "DISEASE_FOUND": uploadStatus = 30; break;
      case "DISEASE_FOUND_FAILED": uploadStatus = 20; break;
      case "HEALTH_METRICS_CALCULATED": uploadStatus = 40; break;
      case "HEALTH_METRICS_CALCULATION_FAILED": uploadStatus = 30; break;
      case "VALID_DISEASE_SEPARATION": uploadStatus = 50; break;
      case "VALID_DISEASE_SEPARATION_FAILED": uploadStatus = 40; break;
      case "MEAT_FOUND": uploadStatus = 70; break;
      case "MEAT_FOUND_FAILED": uploadStatus = 60; break;
      case "COMBINATION_CODES_FOUND": uploadStatus = 70; break;
      case "COMBINATION_CODES_FOUND_FAILED": uploadStatus = 60; break;
      case "RAF_SCORE_FOUND": uploadStatus = 80; break;
      case "RAF_SCORE_FOUND_FAILED": uploadStatus = 70; break;
      case "FINISHED": uploadStatus = 100; break;
      default: uploadStatus = 0; break;
    }

    const currentIndex = stageChartMap[stage] ?? 0;
    const findPreviousStep = (currentStage: string) => {
      const stages = Object.keys(stageChartMap2);
      const idx = stages.indexOf(currentStage);
      if (idx === 0) return stages[idx + 1];
      if (idx > 0) return stages[idx - 1];
      return null;
    };

    const stepsItemBase = [
      { title: "", description: "EMR", info: "FILE_UPLOAD" },
      { title: "", description: "Pre-processing", info: "OCR" },
      { title: "", description: "Diagnosis", info: "DISEASE_FOUND" },
      { title: "", description: "Health metrics", info: "HEALTH_METRICS_CALCULATED" },
      { title: "", description: "Valid diagnosis", info: "VALID_DISEASE_SEPARATION" },
      { title: "", description: "Meat", info: "MEAT_FOUND" },
      { title: "", description: "Combination codes", info: "COMBINATION_CODES_FOUND" },
      { title: "", description: "Completed", info: "FINISHED" },
    ].map((step) => {
      const stepIndex = stageChartMap[step.info];
      const currentStageIndex = stageChartMap[stage] ?? 0;

      const isFinish = currentStageIndex > stepIndex;
      const isCurrent = currentStageIndex === stepIndex && !errStages[stage];
      const isError = currentStageIndex === stepIndex && !!errStages[stage];

      const findData = data?.processStageEventDTOs?.find((item: any) => item?.processStageChart === step.info);
      const timeStr = findData ? formatDateTime({ date: findData.createdDate, formatType: "time" }) : "---";

      return {
        ...step,
        status: isFinish ? "finish" as const : (isError ? "error" as const : (isCurrent ? "process" as const : "wait" as const)),
        description: (
          <div className="flex flex-col items-center justify-center text-center mt-[-5px]">
            <span style={{
              color: isFinish ? "#03512E" : "black",
              fontSize: "12px",
              fontWeight: isFinish || isCurrent ? "600" : "400",
              display: 'block'
            }}>
              {step.description}
            </span>
            <span style={{
              color: "#666",
              fontSize: "10px",
              fontWeight: "400",
              display: 'block',
              marginTop: '4px'
            }}>
              {timeStr}
            </span>
          </div>
        )
      };
    });

    return (
      <div className="flex w-full">
        <div className="w-full">
          <div className={`fileprocessingstepper relative mt-[20px] ml-[-40px] ${errStages[stage] ? "errStages" : ""}`}>
            <Steps
              current={currentIndex}
              labelPlacement="vertical"
              items={stepsItemBase}
              percent={errStages[stage] ? 0 : count}
              style={{ display: stepperStyle, width: "100%" }}
            />
          </div>

          <div className="mt-6 flex items-center gap-3 px-[10px]">
            <div className="flex-grow">
              <Progress
                percent={uploadStatus}
                status="active"
                showInfo={false}
                className="antTextHide"
                strokeColor="#03512E"
                trailColor="#D1D5DB"
                strokeWidth={10}
              />
            </div>
            <div className="flex flex-col items-center text-[10px] font-bold leading-none text-black">
              <span>{uploadStatus}%</span>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const fileProcessingSkeleton = () => (
    <div className="p-10">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="mb-6 flex flex-col items-center">
          <Skeleton.Input active size="large" style={{ width: "100%", marginBottom: "10px" }} />
          <Skeleton.Input active size="large" style={{ width: "100%", marginBottom: "10px" }} />
          <Skeleton.Input active size="large" style={{ width: "100%", marginBottom: "10px" }} />
        </div>
      ))}
    </div>
  );

  return (
    <div className={style.classContaineer}>
      {fileProcessingData?.loading ? (
        fileProcessingSkeleton()
      ) : (
        <table className={style.classTable}>
          <thead className={style.classThead}>
            <tr>
              <th>PATIENT ID</th>
              <th>PATIENT NAME</th>
              <th className="text-center">UPLOAD STATUS</th>
            </tr>
          </thead>
          <tbody>
            {localData.length === 0 ? (
              <tr><td colSpan={3} className="py-20"><Empty /></td></tr>
            ) : (
              localData.map((data, index) => (
                <tr key={index}>
                  <td className={style.firstTdBorder}>{data?.mrNumber}</td>
                  <td className={style.childBorder}>{data?.patientName || "---"}</td>
                  <td className={style.lastBorder} style={{ width: "75%" }}>
                    {renderUploadStatus(data)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default connector(FileProcessingTable);
