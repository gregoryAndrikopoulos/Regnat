import { strict as assert } from "node:assert";
import { faker } from "@faker-js/faker";
import axios from "axios";
import { API } from "../testConstants.js";
import {
  SHORT_TIMEOUT,
  BAD_CREDENTIALS,
} from "../../test-support/utils/testConstants.js";

const asForm = (obj) => new URLSearchParams(Object.entries(obj)).toString();
let tempUser;

// Create a disposable test user via API (not part of test requirements).
before(async function () {
  tempUser = {
    name: faker.person.firstName(),
    email: faker.internet.email({ provider: "example.com" }),
    password: faker.internet.password(),
  };

  const payload = {
    name: tempUser.name,
    email: tempUser.email,
    password: tempUser.password,
    title: "Mr",
    birth_date: "24-05-1993",
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: "United States",
    zipcode: faker.location.zipCode("#####"),
    state: faker.location.state({ abbreviated: true }) || "IL",
    city: faker.location.city(),
    mobile_number: faker.phone.number("+1##########"),
  };

  const res = await axios.post(API.CREATE_ACCOUNT, asForm(payload), {
    timeout: SHORT_TIMEOUT,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  // HTTP stays 200; success indicated by body.responseCode === 201
  assert.equal(res.status, 200);
  assert.equal(Number(res.data?.responseCode), 201);
});

describe("[@api] Verify Login", function () {
  // Use the disposable account created above; no real creds required.
  before(function () {
    if (!tempUser?.email || !tempUser?.password) {
      throw new Error(BAD_CREDENTIALS);
    }
  });

  it("API 7: POST To Verify Login with valid details → 200", async function () {
    const res = await axios.post(
      API.VERIFY_LOGIN,
      asForm({ email: tempUser.email, password: tempUser.password }),
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

// Delete that user via API (not part of test requirements).
after(async function () {
  try {
    const del = await axios.delete(API.DELETE_ACCOUNT, {
      data: asForm({ email: tempUser.email, password: tempUser.password }),
      timeout: SHORT_TIMEOUT,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assert.equal(del.status, 200);
    assert.equal(Number(del.data?.responseCode), 200);
  } catch {
    try {
      const del2 = await axios.post(
        API.DELETE_ACCOUNT,
        asForm({ email: tempUser.email, password: tempUser.password }),
        {
          timeout: SHORT_TIMEOUT,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      assert.equal(Number(del2.data?.responseCode), 200);
    } catch {
      // swallow errors so cleanup never fails the suite
    }
  }
});
