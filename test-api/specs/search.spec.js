import { strict as assert } from "node:assert";
import axios from "axios";
import { API } from "../testConstants.js";
import { SHORT_TIMEOUT } from "../../test-support/utils/testConstants.js";

const asForm = (obj) => new URLSearchParams(Object.entries(obj)).toString();

describe("[@api] Search Product", function () {
  it("API 5: POST To Search Product → 200", async function () {
    const res = await axios.post(
      API.SEARCH_PRODUCT,
      asForm({ search_product: "top" }),
      {
        timeout: SHORT_TIMEOUT,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 200);
  });

  it("API 6: POST To Search Product without search_product parameter → 400", async function () {
    const res = await axios.post(
      API.SEARCH_PRODUCT,
      asForm({}), // missing search_product
      {
        timeout: SHORT_TIMEOUT,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 400);
    const msg = String(res.data?.message ?? res.data ?? "");
    assert.match(msg, /bad request|missing.*search_product/i);
  });
});
