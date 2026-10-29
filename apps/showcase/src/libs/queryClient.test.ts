import { QUERY_KEYS } from "@/config/constants";
import { clearAuthTokens } from "./tokenStorage";
import { MutationObserver } from "@tanstack/react-query";
import { expect, it } from "vitest";
import { queryClient } from "./queryClient";
import { TimeoutError } from "./apiError";

it("does not repeat a mutation after an ambiguous timeout", async () => {
  let calls = 0;
  const mutation = new MutationObserver(queryClient, {
    mutationFn: async () => {
      calls++;
      throw new TimeoutError();
    },
  });
  await expect(mutation.mutate()).rejects.toBeInstanceOf(TimeoutError);
  expect(calls).toBe(1);
});

it("clears private cached data when the transport expires the session", () => {
  queryClient.setQueryData(["private-records"], [{ id: "sensitive" }]);
  queryClient.setQueryData(QUERY_KEYS.AUTH.USER, { id: "42" });
  clearAuthTokens();
  expect(queryClient.getQueryData(["private-records"])).toBeUndefined();
  expect(queryClient.getQueryData(QUERY_KEYS.AUTH.USER)).toBeNull();
});
