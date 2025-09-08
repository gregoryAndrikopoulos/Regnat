import { strict as assert } from "node:assert";
import axios from "axios";
import { faker } from "@faker-js/faker";
import { API } from "../testConstants.js";
import {
  SHORT_TIMEOUT,
  STANDARD_TIMEOUT,
} from "../../test-support/utils/testConstants.js";

const asForm = (obj) => new URLSearchParams(Object.entries(obj)).toString();

describe("[@api] Account", function () {
  const email = `api.user.${Date.now()}@example.com`;
  const password = "P@ssw0rd123";

  const baseProfile = {
    name: faker.person.fullName(),
    email,
    password,
    title: "Mr",
    birth_date: "10",
    birth_month: "12",
    birth_year: "1990",
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: "Canada",
    zipcode: "A1A1A1",
    state: "ON",
    city: "Toronto",
    mobile_number: faker.phone.number("+1##########"),
  };

  it("API 11: POST To Create/Register User Account → 201", async function () {
    const res = await axios.post(API.CREATE_ACCOUNT, asForm(baseProfile), {
      timeout: STANDARD_TIMEOUT,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assert.equal(res.status, 200); // HTTP is 200
    assert.equal(Number(res.data?.responseCode), 201); // Body indicates 201
    const msg = String(res.data?.message ?? res.data ?? "");
    assert.match(msg, /user created/i);
  });

  it("API 13: PUT METHOD To Update User Account → 200", async function () {
    const updated = {
      ...baseProfile,
      city: "Ottawa",
      name: `${baseProfile.name} Jr`,
    };
    const res = await axios.put(API.UPDATE_ACCOUNT, asForm(updated), {
      timeout: STANDARD_TIMEOUT,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 200);
    const msg = String(res.data?.message ?? res.data ?? "");
    assert.match(msg, /user updated/i);
  });

  it("API 14: GET user account detail by email → 200", async function () {
    const url = `${API.GET_USER_BY_EMAIL}?email=${encodeURIComponent(email)}`;
    const res = await axios.get(url, { timeout: SHORT_TIMEOUT });
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 200);
  });

  it("API 12: DELETE METHOD To Delete User Account → 200", async function () {
    const res = await axios.delete(API.DELETE_ACCOUNT, {
      timeout: SHORT_TIMEOUT,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: asForm({ email, password }), // axios requires data for DELETE payloads
    });
    assert.equal(res.status, 200);
    assert.equal(Number(res.data?.responseCode), 200);
    const msg = String(res.data?.message ?? res.data ?? "");
    assert.match(msg, /account deleted/i);
  });
});
