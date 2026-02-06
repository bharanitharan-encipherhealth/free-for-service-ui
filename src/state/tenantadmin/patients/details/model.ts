import {
  patientDiseaseDetailstype,
  patientDosDetailsType,
  patientHccFileType,
  patientOverallDetailsType,
  patientOverallYearType,
  patientWorkQueueDataType,
  timeListType,
  versionHistorytype,
} from "@/models/tenantadmin/patients/details";
import {
  commentsType,
  notesType,
} from "@/models/tenantadmin/patients/DiagnosisDetails";

export default class patinetDetailsReducerType {
  patientOverallDetails: {
    loading: boolean;
    error: string;
    data: patientOverallDetailsType;
  };
  patietOverallDetailsLoading: boolean;
  setAdmissionNumber: { patientType: string; admNo: string; bacthDate: string };
  patientOverallYear: {
    loading: boolean;
    error: string;
    data: patientOverallYearType;
  };
  patientOverallYearLoading: boolean;
  setPatientOverallYear: number;
  patientDosDetailsLoading: boolean;
  patientDosDetails: {
    loading: false;
    error: string;
    data: patientDosDetailsType;
  };
  setSelectDos: string;
  getSelectedDosPageNumber: string;
  setPdfSearch: {
    value: string;
    page: number;
    headers?: boolean;
    headerContent?: string;
  };
  patientDiseaseDetails: {
    loading: false;
    error: string;
    data: patientDiseaseDetailstype;
  };
  patientDiseaseDetailsLoading: boolean;

  getFileIdCheckLoading: boolean;
  getFileIdCheck: {
    loading: boolean;
    error: string;
    data: { status: string; message: string; response: string };
  };

  patientHccFieLoading: boolean;
  patientHccFileDetails: {
    loading: boolean;
    error: string;
    data: patientHccFileType;
  };

  patientWorkQueueLoading: boolean;
  patientWorkQueueData: {
    loading: boolean;
    error: string;
    data: patientWorkQueueDataType;
  };

  setPageLoading: boolean;

  timelineListLoading: boolean;
  timelineList: { data: timeListType; loading: boolean; error: string };

  timelineActionData: {
    data: { status: string; message: string; response: string[] };
    loading: boolean;
    error: string;
  };

  getCommentLoading: boolean;

  commentList: { data: commentsType; loading: boolean; error: string };

  notesLoading: boolean;
  notesLists: { data: notesType; loading: boolean; error: string };

  getVersionHistoryloading: boolean;
  getVersionHistory: {
    data: versionHistorytype;
    loading: boolean;
    error: string;
  };

  setPdfView: boolean;

  constructor(
    patientOverallYear: {
      loading: false;
      error: "fail";
      data: {
        status: "fail";
        message: "fail";
        response: [0];
      };
    },
    patientOverallDetails: {
      data: {
        status: "fail";
        message: "fail";
        response: {
          createdDate: "";
          lastModifiedDate: "";
          active: false;
          version: 0;

          createdBy: "";
          lastModifiedBy: "";

          id: "";
          patientId: "";
          patientName: "";

          mrNumber: "";
          dob: "";
          age: "";

          gender: "";

          batchId: "";
          batchDate: "";

          latestFileUploadDate: "";

          computing: 0;

          processStageChart: "";
          processStageId: "";

          processedDate: "";
          processedStatus: "";

          computedDate: "";

          fileName: "";

          priority: "";

          emr: "";
          tin: 0;

          totalPages: 0;

          computationList: [];

          isReEvaluateNeed: false;
          movedAfterReEvaluateIsOff: false;

          workflow: [];

          currentStatus: {
            roleId: "";
            allocatedTo: null;
            allocatedBy: null;
            allocatedOn: null;

            status: "";
            dueDate: null;
            performedOn: null;

            reAssigned: false;
            query: null;
            queryDetails: null;
            priority: null;

            alreadyQueried: false;

            codingAction: {
              roleId: null;
              userName: null;

              editedCodes: [];
              editedCodesCount: 0;

              addedCodes: [];
              addedCodesCount: 0;

              deletedCodes: [];
              deletedCodesCount: 0;

              movedCodes: [];
              movedCodesCount: 0;

              correctCodes: [];
              correctCodesCount: 0;

              incorrectCodes: [];
              incorrectCodesCount: 0;

              submittedCodes: [];
              submittedCodesCount: 0;

              educationalErrorCodes: [];
              educationalErrorCount: 0;

              accuracy: 0;
            };

            rebuttedOn: null;
            rebuttalTriggeredOn: null;
            rebuttalNotCompleted: false;
            alreadyRebutted: false;

            randomSampled: false;
          };

          patientType: "";
          admNo: "";
          admDate: "";
        };
      };
      loading: false;
      error: "fail";
    },
    patietOverallDetailsLoading: false,
    setAdmissionNumber: { patientType: ""; admNo: ""; bacthDate: "" },
    patientOverallYearLoading: false,
    setPatientOverallYear: 0,
    patientDosDetailsLoading: false,

    patientDosDetails: {
      loading: false;
      error: "fail";
      data: {
        status: "fails";
        message: "fail";
        response: [
          {
            processedStatus: null;

            dateOfService: "";
            formattedDos: "";

            fileId: "";
            fileDetailDTO: {
              id: "";
              fileId: "";
              batchId: null;
              patientId: "";
              mrn: "";

              userId: "";
              orgId: "";
              tenantId: "";

              dos: null;

              fileName: "";
              azureBlobPath: "";

              radiologyAzureBlobPaths: null;
              fileSearchDetails: null;
              exceptionLogInfo: null;
              fileDetails: null;

              alreadyPresentFileId: null;
              fileHash: null;
              isFileHashAlreadyPresent: null;
              isHazardFile: null;

              yearOfServices: null;
              dateOfServices: null;

              dosSummaries: [];

              emrType: "";
              batchTrigger: false;

              fileExtension: null;
              totalPages: null;

              batchProcessFor: null;
              fileTypeForConrad: null;

              isRequestForRetry: null;

              workflowDetails: null;
              workflowRoutes: null;
            };

            stateIndicators: [];
            patientFlag: [];

            flagsWithColor: [];

            workflow: [];
            currentStatus: null;

            masterAudit: null;
            providerName: "";
          },
        ];
      };
    },
    setSelectDos: "",
    getSelectedDosPageNumber: "",
    setPdfSearch: { value: ""; page: 0; headers: false; headerContent: "" },
    patientDiseaseDetails: {
      loading: false;
      error: "fail";
      data: {
        message: "fail";
        status: "fail";
        response: {
          id: "";
          patientId: "";
          patientName: "";

          dateOfService: "";
          mrNumber: "";

          dob: null;
          gender: null;

          fileId: "";
          fileInfos: [];

          processedYear: 0;
          processedStatus: null;
          processDate: null;

          hccDiseases: [];
          nonHccDiseases: [];
          deletedDiseases: [];

          suggestedHccDiseases: [];
          potentialDiseases: [];
          comboDisease: [];

          meatCriteria: [];
          deletedMeatCriteria: [];

          rafScore: {
            v24Score: null;
            v28Score: null;
            score: null;

            rafVersionDTO: null;
            scoreOutputDTOList: null;

            v24Score70Percent: null;
            v28Score30Percent: null;
          };

          meatQuery: [];

          fileDetailDTO: {
            id: "";
            fileId: "";

            batchId: null;
            patientId: "";
            mrn: "";

            userId: "";
            orgId: "";
            tenantId: "";

            dos: null;

            fileName: "";
            azureBlobPath: "";

            radiologyAzureBlobPaths: null;
            fileSearchDetails: null;
            exceptionLogInfo: null;
            fileDetails: null;

            alreadyPresentFileId: null;
            fileHash: null;

            isFileHashAlreadyPresent: null;
            isHazardFile: null;

            yearOfServices: null;
            dateOfServices: null;

            dosSummaries: [];

            emrType: "";
            batchTrigger: false;

            fileExtension: null;
            totalPages: null;

            batchProcessFor: null;
            fileTypeForConrad: null;

            isRequestForRetry: null;

            workflowDetails: null;
            workflowRoutes: null;
          };

          totalTimeForComputation: 0;

          flags: [];
          workflow: [];

          currentStatus: null;

          summary: "";

          reEvaluateNeed: false;
          movedAfterReEvaluateIsOff: false;

          masterAudit: false;

          faceToFace: false;
          visitType: "";
        };
      };
    },
    patientDiseaseDetailsLoading: false,

    getFileIdCheck: {
      loading: false;
      error: "fail";
      data: {
        status: "fail";
        message: "fails";
        response: "";
      };
    },
    getFileIdCheckLoading: false,

    patientHccFieLoading: false,
    patientHccFileDetails: {
      loading: false;
      error: "fail";
      data: {
        message: "fail";
        status: "fail";
        response: {
          id: "";
          fileId: "";
          batchId: null;
          patientId: "";
          mrn: "";

          userId: "";
          orgId: "";
          tenantId: "";

          dos: null;

          fileName: "";
          azureBlobPath: "";

          radiologyAzureBlobPaths: null;
          fileSearchDetails: null;
          exceptionLogInfo: null;
          fileDetails: null;

          alreadyPresentFileId: null;
          fileHash: null;
          isFileHashAlreadyPresent: null;
          isHazardFile: null;

          yearOfServices: null;
          dateOfServices: null;

          dosSummaries: [];

          emrType: "";
          batchTrigger: false;

          fileExtension: null;
          totalPages: null;

          batchProcessFor: null;
          fileTypeForConrad: null;

          isRequestForRetry: null;

          workflowDetails: null;
          workflowRoutes: null;
        };
      };
    },
    patientWorkQueueLoading: false,

    patientWorkQueueData: {
      data: {
        status: "fail";
        message: "fail";
        response: {
          pageResponse: {
            content: [
              {
                createdDate: "";
                lastModifiedDate: "";
                active: false;
                version: 0;

                createdBy: "";
                lastModifiedBy: "";

                id: "";
                patientId: "";
                patientName: "";

                mrNumber: "";
                dob: "";
                age: "";

                gender: "";

                batchId: "";
                batchDate: "";

                latestFileUploadDate: "";

                computing: 0;

                processStageChart: "";
                processStageId: "";

                processedDate: "";
                processedStatus: "";

                computedDate: "";

                fileName: "";

                priority: "";

                emr: "";
                tin: 0;

                totalPages: 0;

                computationList: [];

                isReEvaluateNeed: false;
                movedAfterReEvaluateIsOff: false;

                workflow: [];

                currentStatus: {
                  roleId: "";
                  allocatedTo: null;
                  allocatedBy: null;
                  allocatedOn: null;

                  status: "";
                  dueDate: null;
                  performedOn: null;

                  reAssigned: false;
                  query: null;
                  queryDetails: null;
                  priority: null;

                  alreadyQueried: false;

                  codingAction: {
                    roleId: null;
                    userName: null;

                    editedCodes: [];
                    editedCodesCount: 0;

                    addedCodes: [];
                    addedCodesCount: 0;

                    deletedCodes: [];
                    deletedCodesCount: 0;

                    movedCodes: [];
                    movedCodesCount: 0;

                    correctCodes: [];
                    correctCodesCount: 0;

                    incorrectCodes: [];
                    incorrectCodesCount: 0;

                    submittedCodes: [];
                    submittedCodesCount: 0;

                    educationalErrorCodes: [];
                    educationalErrorCount: 0;

                    accuracy: 0;
                  };

                  rebuttedOn: null;
                  rebuttalTriggeredOn: null;
                  rebuttalNotCompleted: false;
                  alreadyRebutted: false;

                  randomSampled: false;
                };

                patientType: "";
                admNo: "";
                admDate: "";
              },
            ];
            pageable: {
              pageNumber: 0;
              pageSize: 0;
              sort: {
                sorted: false;
                empty: false;
                unsorted: false;
              };
              offset: 0;
              paged: false;
              unpaged: false;
            };
            last: false;
            totalPages: 0;
            totalElements: 0;
            first: false;
            size: 0;
            number: 0;
            sort: {
              sorted: false;
              empty: false;
              unsorted: false;
            };
            numberOfElements: 0;
            empty: false;
          };
          processStatusCount: undefined;
          patientIds: null;
          tinNumbers: null;
          metaDataDTO: [
            {
              headerName: "MBI";
              actualField: "mbi";
              active: true;
              columnActive: true;
              design: [];
              filter: {
                filter: "";
                style: "SEARCH";
                options: [];
                nameOptions: [];
              };
              orderValue: 1;
            },
          ];
          staticDesign: [];
          mciPatientCountDTO: {
            pendingCount: "";
            approvedCount: "";
            rejectedCount: "";
            holdCount: null;
          };
          totalResponse: null;
        };
      };
      loading: false;
      error: "fail";
    },
    setPageLoading: false,
    timelineListLoading: false,
    timelineList: {
      loading: false;
      error: "fail";
      data: {
        message: "fail";
        status: "fail";
        response: {
          content: [
            {
              createdDate: "";
              lastModifiedDate: "";
              active: false;
              version: 0;

              createdBy: "";
              lastModifiedBy: "";

              id: "";
              patientId: "";
              userName: "";

              actionCreatedDate: "";
              action: "";

              diagnosisCode: "";
              fullName: "";

              previousDiseaseFormat: {
                id: "";
                diagnosisCode: "";

                actualDescription: "";
                dbDescription: "";

                notes: null;

                capturedSections: [];
                dateOfServices: [];

                hyperlinks: [];
                dosHyperlinks: [];

                manuallyAddedDetails: {
                  isManuallyAdded: false;
                  manuallyAddedAt: "";
                  manuallyAddedBy: "";
                };

                defaultPosition: "";

                providerNames: [];
                providerHyperlinks: [];

                formedCodes: [];
                children: [];

                stateIndicators: [];

                isShow: false;
                diseaseSource: "";

                suspectType: [];

                uniqueIds: [];

                riskAdjustmentDtoList: null;
                hccCategoryDataList: null;
                addOnCodes: null;

                ruleType: null;
                reason: null;

                educationalError: false;

                oldValue: [];
                newValue: [];

                comment: null;
                lastAddedComment: null;

                isRxHcc: false;
                isCmsHcc: false;
              };
              changedDiseaseFormat: {
                id: "";
                diagnosisCode: "";

                actualDescription: "";
                dbDescription: "";

                notes: null;

                capturedSections: [];
                dateOfServices: [];

                hyperlinks: [];
                dosHyperlinks: [];

                manuallyAddedDetails: {
                  isManuallyAdded: false;
                  manuallyAddedAt: "";
                  manuallyAddedBy: "";
                };

                defaultPosition: "";

                providerNames: [];
                providerHyperlinks: [];

                formedCodes: [];
                children: [];

                stateIndicators: [];

                isShow: false;
                diseaseSource: "";

                suspectType: [];

                uniqueIds: [];

                riskAdjustmentDtoList: null;
                hccCategoryDataList: null;
                addOnCodes: null;

                ruleType: null;
                reason: null;

                educationalError: false;

                oldValue: [];
                newValue: [];

                comment: null;
                lastAddedComment: null;

                isRxHcc: false;
                isCmsHcc: false;
              };

              previousMeatDetail: {
                diseaseName: "";
                diagnosisCode: "";

                uniqueIds: [];

                providerNames: [];
                providerHyperlinks: [];

                dateOfService: [];
                dosHyperlinks: [];

                isMeatCriteriaPresent: false;

                monitorAspect: "";
                monitorHyperLink: [];

                evaluateAspect: "";
                evaluateHyperLink: [];

                assessmentAspect: "";
                assessmentHyperLink: [];

                treatmentAspect: "";
                treatmentHyperLink: [];

                isShow: false;

                encounterDate: null;

                isManuallyAdded: null;
                manuallyAddedAt: null;

                visitDetailsDTO: null;

                monitorCapturedFromHeader: null;
                monitor: null;

                evaluateCapturedFromHeader: null;
                evaluate: null;

                assessmentCapturedFromHeader: null;
                assessment: null;

                treatmentCapturedFromHeader: null;
                treatment: null;

                stateIndicators: [];

                isRxHcc: false;
                isCmsHcc: false;
              };
              changedMeatDetail: null;

              previousProcedure: null;
              changedProcedure: null;

              fromState: "";
              toState: "";
              manuallyAddedState: null;

              computationYear: 0;
              actionNotes: null;

              previousProcessedState: null;
              dos: "";
              processedYear: null;

              flagDetails: {
                id: "";
                priority: 0;
                flagName: "";
                flagIcon: "";
                flagColour: "";
                createdDate: "";
                lastModifiedDate: "";
                active: false;
                version: 0;
                createdBy: "";
                lastModifiedBy: "";
              };

              previousProviderInfo: null;
              changedProviderInfo: null;
              previousDosProviderInfo: null;
              changedDosProviderInfo: null;

              htmlContent: "";

              stateIndicator: [];

              previousDemography: null;
              changedDemography: null;

              revertHistory: 0;
              isCurrentVersion: false;

              aliasName: "";
              educationalError: false;

              previousCoderRoleId: null;
              currentCoderRoleId: null;

              rebuttalStatus: null;
              isMarkedAsComplete: null;
              rebuttalReason: null;

              roleList: null;

              comment: null;
            },
          ];
          pageable: {
            pageNumber: 0;
            pageSize: 0;
            sort: {
              sorted: false;
              empty: false;
              unsorted: false;
            };
            offset: 0;
            paged: false;
            unpaged: false;
          };
          last: false;
          totalPages: 0;
          totalElements: 0;
          first: false;
          size: 0;
          number: 0;
          sort: {
            sorted: false;
            empty: false;
            unsorted: false;
          };
          numberOfElements: 0;
          empty: false;
        };
      };
    },
    timelineActionData: {
      data: { response: [""]; status: ""; message: "" };
      error: "";
      loading: false;
    },
    getCommentLoading: false,
    commentList: {
      data: {
        response: [
          {
            createdDate: "";
            lastModifiedDate: "";
            active: false;
            version: 0;
            createdBy: "";
            lastModifiedBy: "";
            commentId: "";
            userComment: "";
            createdByDetails: {
              firstName: "";
              lastName: "";
              userName: "";
              profileImageUrl: string;
              role: "";
            };
            processedYear: 0;
            dateOfService: "";
          },
        ];
        status: "";
        message: "";
      };
      loading: false;
      error: "";
    },
    notesLoading: false,
    notesLists: {
      data: {
        response: [
          {
            createdDate: "";
            lastModifiedDate: "";
            active: false;
            version: 0;
            createdBy: "";
            lastModifiedBy: "";
            commentId: "";
            userComment: "";
            createdByDetails: {
              firstName: "";
              lastName: "";
              userName: "";
              profileImageUrl: string;
              role: "";
            };
            processedYear: 0;
            dateOfService: "";
            note: "";
            noteId: "";
          },
        ];
        status: "";
        message: "";
      };
      loading: false;
      error: "";
    },
    getVersionHistoryloading: false,
    getVersionHistory: {
      loading: false;
      error: "fail";
      data: {
        message: "fail";
        status: "fail";
        response: [
          {
            createdDate: "";
            lastModifiedDate: "";
            active: false;
            version: 0;

            createdBy: "";
            lastModifiedBy: "";

            id: "";
            patientId: "";
            userName: "";

            actionCreatedDate: "";
            action: "";

            diagnosisCode: "";
            fullName: "";

            previousDiseaseFormat: {
              id: "";
              diagnosisCode: "";

              actualDescription: "";
              dbDescription: "";

              notes: null;

              capturedSections: [];
              dateOfServices: [];

              hyperlinks: [];
              dosHyperlinks: [];

              manuallyAddedDetails: {
                isManuallyAdded: false;
                manuallyAddedAt: "";
                manuallyAddedBy: "";
              };

              defaultPosition: "";

              providerNames: [];
              providerHyperlinks: [];

              formedCodes: [];
              children: [];

              stateIndicators: [];

              isShow: false;
              diseaseSource: "";

              suspectType: [];

              uniqueIds: [];

              riskAdjustmentDtoList: null;
              hccCategoryDataList: null;
              addOnCodes: null;

              ruleType: null;
              reason: null;

              educationalError: false;

              oldValue: [];
              newValue: [];

              comment: null;
              lastAddedComment: null;

              isRxHcc: false;
              isCmsHcc: false;
            };
            changedDiseaseFormat: {
              id: "";
              diagnosisCode: "";

              actualDescription: "";
              dbDescription: "";

              notes: null;

              capturedSections: [];
              dateOfServices: [];

              hyperlinks: [];
              dosHyperlinks: [];

              manuallyAddedDetails: {
                isManuallyAdded: false;
                manuallyAddedAt: "";
                manuallyAddedBy: "";
              };

              defaultPosition: "";

              providerNames: [];
              providerHyperlinks: [];

              formedCodes: [];
              children: [];

              stateIndicators: [];

              isShow: false;
              diseaseSource: "";

              suspectType: [];

              uniqueIds: [];

              riskAdjustmentDtoList: null;
              hccCategoryDataList: null;
              addOnCodes: null;

              ruleType: null;
              reason: null;

              educationalError: false;

              oldValue: [];
              newValue: [];

              comment: null;
              lastAddedComment: null;

              isRxHcc: false;
              isCmsHcc: false;
            };

            previousMeatDetail: {
              diseaseName: "";
              diagnosisCode: "";

              uniqueIds: [];

              providerNames: [];
              providerHyperlinks: [];

              dateOfService: [];
              dosHyperlinks: [];

              isMeatCriteriaPresent: false;

              monitorAspect: "";
              monitorHyperLink: [];

              evaluateAspect: "";
              evaluateHyperLink: [];

              assessmentAspect: "";
              assessmentHyperLink: [];

              treatmentAspect: "";
              treatmentHyperLink: [];

              isShow: false;

              encounterDate: null;

              isManuallyAdded: null;
              manuallyAddedAt: null;

              visitDetailsDTO: null;

              monitorCapturedFromHeader: null;
              monitor: null;

              evaluateCapturedFromHeader: null;
              evaluate: null;

              assessmentCapturedFromHeader: null;
              assessment: null;

              treatmentCapturedFromHeader: null;
              treatment: null;

              stateIndicators: [];

              isRxHcc: false;
              isCmsHcc: false;
            };
            changedMeatDetail: null;

            previousProcedure: null;
            changedProcedure: null;

            fromState: "";
            toState: "";
            manuallyAddedState: null;

            computationYear: 0;
            actionNotes: null;

            previousProcessedState: null;
            dos: "";
            processedYear: null;

            flagDetails: {
              id: "";
              priority: 0;
              flagName: "";
              flagIcon: "";
              flagColour: "";
              createdDate: "";
              lastModifiedDate: "";
              active: false;
              version: 0;
              createdBy: "";
              lastModifiedBy: "";
            };

            previousProviderInfo: null;
            changedProviderInfo: null;
            previousDosProviderInfo: null;
            changedDosProviderInfo: null;

            htmlContent: "";

            stateIndicator: [];

            previousDemography: null;
            changedDemography: null;

            revertHistory: 0;
            isCurrentVersion: false;

            aliasName: "";
            educationalError: false;

            previousCoderRoleId: null;
            currentCoderRoleId: null;

            rebuttalStatus: null;
            isMarkedAsComplete: null;
            rebuttalReason: null;

            roleList: null;

            comment: null;
          },
        ];
      };
    },
    setPdfView: false,
  ) {
    this.patientOverallDetails = patientOverallDetails;
    this.patietOverallDetailsLoading = patietOverallDetailsLoading;
    this.setAdmissionNumber = setAdmissionNumber;
    this.patientOverallYear = patientOverallYear;
    this.patientOverallYearLoading = patientOverallYearLoading;
    this.setPatientOverallYear = setPatientOverallYear;
    this.patientDosDetailsLoading = patientDosDetailsLoading;
    this.patientDosDetails = patientDosDetails;
    this.setSelectDos = setSelectDos;
    this.getSelectedDosPageNumber = getSelectedDosPageNumber;
    this.setPdfSearch = setPdfSearch;
    this.patientDiseaseDetails = patientDiseaseDetails;
    this.patientDiseaseDetailsLoading = patientDiseaseDetailsLoading;
    this.patientHccFieLoading = patientHccFieLoading;
    this.getFileIdCheckLoading = getFileIdCheckLoading;
    this.getFileIdCheck = getFileIdCheck;
    this.patientHccFileDetails = patientHccFileDetails;
    this.patientWorkQueueLoading = patientWorkQueueLoading;
    this.patientWorkQueueData = patientWorkQueueData;
    this.setPageLoading = setPageLoading;
    this.timelineListLoading = timelineListLoading;
    this.timelineList = timelineList;
    this.timelineActionData = timelineActionData;
    this.getCommentLoading = getCommentLoading;
    this.commentList = commentList;
    this.notesLoading = notesLoading;
    this.notesLists = notesLists;
    this.getVersionHistoryloading = getVersionHistoryloading;
    this.getVersionHistory = getVersionHistory;
    this.setPdfView = setPdfView;
  }
}
