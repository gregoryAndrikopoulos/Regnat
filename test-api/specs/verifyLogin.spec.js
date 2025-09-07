import { strict as assert } from "node:assert";
import axios from "axios";
import {
  API,
  VALID_EMAIL,
  VALID_PASSWORD,
  BAD_CREDENTIALS,
  SHORT_TIMEOUT,
} from "../testConstants.js";

const asForm = (obj) => new URLSearchParams(Object.entries(obj)).toString();

describe("[@api] Verify Login", function () {
  before(function () {
    if (!VALID_EMAIL || !VALID_PASSWORD) {
      throw new Error(BAD_CREDENTIALS);
    }
  });

  it("API 7: POST To Verify Login with valid details → 200", async function () {
    const res = await axios.post(
      API.VERIFY_LOGIN,
      asForm({ email: VALID_EMAIL, password: VALID_PASSWORD }),
      {
        timeout: SHORT_TIMEOUT,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 200);
    const msg = String(res.data?.message ?? res.data ?? "");
    assert.match(msg, /user exists/i);
  });

  it("API 8: POST To Verify Login without email parameter → 400", async function () {
    const res = await axios.post(
      API.VERIFY_LOGIN,
      asForm({ password: "whatever" }),
      {
        timeout: SHORT_TIMEOUT,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 400);
    const msg = String(res.data?.message ?? res.data ?? "");
    assert.match(msg, /bad request|email.*missing/i);
  });

  it("API 9: DELETE To Verify Login → 405", async function () {
    const res = await axios.delete(API.VERIFY_LOGIN, {
      timeout: SHORT_TIMEOUT,
    });
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 405);
    const msg = String(res.data?.message ?? res.data ?? "");
    assert.match(msg, /not supported/i);
  });

  it("API 10: POST To Verify Login with invalid details → 404", async function () {
    const res = await axios.post(
      API.VERIFY_LOGIN,
      asForm({ email: "does-not-exist@example.com", password: "wrong" }),
      {
        timeout: SHORT_TIMEOUT,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 404);
    const msg = String(res.data?.message ?? res.data ?? "");
    assert.match(msg, /user not found/i);
  });
});
