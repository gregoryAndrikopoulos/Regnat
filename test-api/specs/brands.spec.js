import { strict as assert } from "node:assert";
import axios from "axios";
import { API } from "../testConstants.js";
import { SHORT_TIMEOUT } from "../../test-support/utils/testConstants.js";

describe("[@api] Brands", function () {
  it("API 3: Get All Brands List → 200", async function () {
    const res = await axios.get(API.BRANDS_LIST, { timeout: SHORT_TIMEOUT });
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 200);
  });

  it("API 4: PUT To All Brands List → 405", async function () {
    const res = await axios.put(
      API.BRANDS_LIST,
      {},
      { timeout: SHORT_TIMEOUT }
    );
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 405);
    const msg = String(res.data?.message ?? res.data ?? "");
    assert.match(msg, /not supported/i);
  });
});
