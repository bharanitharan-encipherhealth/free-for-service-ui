import { requestPortal } from "@/util/network";
import { getStorage } from "@/util/storage";
import { tinNumber } from "@/util/config";

export async function getRoles({ pageId }: { pageId: string }) {
  const tin = tinNumber;
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/allocation/roles?tin=${tin}&pageId=${pageId || ""}`,
    options,
  );
  return res;
}
