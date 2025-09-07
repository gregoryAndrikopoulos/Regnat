import { strict as assert } from "node:assert";
import axios from "axios";
import { API, SHORT_TIMEOUT } from "../testConstants.js";

describe("[@api] Products", function () {
  it("API 1: Get All Products List → 200", async function () {
    const res = await axios.get(API.PRODUCTS_LIST, { timeout: SHORT_TIMEOUT });
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 200);
  });

  it("API 2: POST To All Products List → 405", async function () {
    const res = await axios.post(
      API.PRODUCTS_LIST,
      {},
      { timeout: SHORT_TIMEOUT }
    );
    assert.equal(res.status, 200); // API responds 200 with body responseCode
    assert.equal(Number(res.data?.responseCode), 405);
    const msg = String(res.data?.message ?? res.data ?? "");
    assert.match(msg, /not supported/i);
  });
});
