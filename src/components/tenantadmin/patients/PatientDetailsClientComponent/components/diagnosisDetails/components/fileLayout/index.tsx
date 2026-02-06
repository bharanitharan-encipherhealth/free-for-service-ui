import { FileLayoutType } from "@/models/tenantadmin/patients/DiagnosisDetails";
import style from "../../style.module.css";
import { IoIosArrowBack } from "react-icons/io";
export default function FileLayout({
  collapse,
  setCollapse,
  diseaseCategories,
  activeTab,
}: FileLayoutType) {
  return (
    <div className="flex gap-3 h-full overflow-hidden w-full">
      {diseaseCategories?.map((item, index) => {
        return (
          <>
            {(item?.id == 1 || item?.id == 2) && (
              <div
                className={`${style?.[item?.layout]} p-2 flex flex-col min-h-0 ${collapse?.includes(item?.layout) ? "w-full" : "w-20 flex justify-center cursor-pointer items-center"}`}
                key={item?.id + index}
                onClick={() => {
                  if (!collapse?.includes(item?.layout)) {
                    setCollapse((prev) => [...prev, item?.layout]);
                  }
                }}
              >
                <div className="flex justify-between mb-2 items-center mt-1 shrink-0">
                  <div className="flex gap-3 items-center font-semibold">
                    <div
                      className={`${style?.[item?.layout + "TextColor"]} font-bold text-sm ${!collapse?.includes(item?.layout) && "[writing-mode:vertical-rl]"}`}
                    >
                      {item?.cardTitle?.toUpperCase()}
                    </div>
                    {collapse?.includes(item?.layout) && (
                      <span>{item?.length || 0}</span>
                    )}
                  </div>
                  {collapse?.includes(item?.layout) && (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setCollapse((prev) =>
                          prev?.filter((c) => c != item?.layout),
                        );
                      }}
                    >
                      <IoIosArrowBack className="font-bold text-xl" />
                    </div>
                  )}
                </div>

                {collapse?.includes(item?.layout) && (
                  <div className="flex-1 min-h-0 overflow-auto mb-3">
                    {item?.children}
                  </div>
                )}
              </div>
            )}
            {item?.id == 3 && (
              <div
                className={`grid flex-col gap-3 h-full overflow-hidden ${collapse?.includes(item?.layout) ? "w-full" : "w-20 cursor-pointer"}`}
              >
                {[
                  ...(activeTab == 1
                    ? [
                        diseaseCategories?.find((i) => i?.id == 3),
                        diseaseCategories?.find((i) => i?.id == 4),
                      ]
                    : [diseaseCategories?.find((i) => i?.id == 4)]),
                ]?.map((data, index) => {
                  return (
                    <div
                      className={`${style?.[data!.layout]} p-2 w-full h-full flex flex-col min-h-0 ${collapse?.includes(item?.layout) ? "w-full" : "flex justify-center cursor-pointer items-center"}`}
                      key={data!.id + index}
                      onClick={() => {
                        if (!collapse?.includes(item?.layout)) {
                          setCollapse((prev) => [...prev, item?.layout]);
                        }
                      }}
                    >
                      <div className="flex justify-between mb-2 items-center mt-1 shrink-0">
                        <div className="flex gap-3 items-center font-semibold">
                          <div
                            className={`${style?.[item?.layout + "TextColor"]} font-bold text-sm ${!collapse?.includes(item?.layout) && "[writing-mode:vertical-rl]"}`}
                          >
                            {data?.cardTitle?.toUpperCase()}
                          </div>
                          {collapse?.includes(item?.layout) && (
                            <span>{item?.length || 0}</span>
                          )}
                        </div>
                        {index == 0 && collapse?.includes(item?.layout) && (
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setCollapse((prev) =>
                                prev?.filter((c) => c != item?.layout),
                              );
                            }}
                          >
                            <IoIosArrowBack className="font-bold text-xl" />
                          </div>
                        )}
                      </div>

                      {collapse?.includes(item?.layout) && (
                        <div className="flex-1 min-h-0 overflow-auto mb-3">
                          {item?.children}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      })}
    </div>
  );
}
