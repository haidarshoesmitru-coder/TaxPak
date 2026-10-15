import test from "node:test";
import assert from "node:assert/strict";
import { incomeTax, validateSlabs, salesTax, customs } from "../lib/engine.ts";
import { fy202627 } from "../lib/rules/fy2026-27.ts";
import { fy202526 } from "../lib/rules/fy2025-26.ts";

for (const r of [fy202627, fy202526])
  test(`FY ${r.fy}: slab table is internally consistent`, () => assert.deepEqual(validateSlabs(r.salaried.slabs), []));

test("validateSlabs catches a typo", () => {
  const bad = structuredClone(fy202627.salaried.slabs); bad[3].fixed = 117_000;
  assert.ok(validateSlabs(bad).length > 0);
});

test("FY26-27 boundaries match the official table", () => {
  const t = (a) => incomeTax(a, fy202627.salaried).total;
  assert.equal(t(600_000), 0);
  assert.equal(t(1_200_000), 6_000);
  assert.equal(t(2_200_000), 116_000);
  assert.equal(t(3_200_000), 316_000);
  assert.equal(t(4_100_000), 541_000);
  assert.equal(t(5_600_000), 976_000);
  assert.equal(t(7_000_000), 1_424_000);
  assert.equal(t(8_000_000), 1_424_000 + 350_000);
});

test("Rs 150,000/month is Rs 6,000/month tax in FY26-27", () =>
  assert.equal(incomeTax(150_000 * 12, fy202627.salaried).monthly, 6_000));

test("FY25-26 surcharge applies only above Rs 10M", () => {
  assert.equal(incomeTax(10_000_000, fy202526.salaried).surcharge, 0);
  const r = incomeTax(12_000_000, fy202526.salaried);
  assert.equal(r.tax, 3_381_000);
  assert.ok(Math.abs(r.surcharge - 304_290) < 0.01);
});

test("sales tax both modes", () => {
  assert.equal(salesTax(10_000, 18, "exclusive").total, 11_800);
  assert.ok(Math.abs(salesTax(11_800, 18, "inclusive").base - 10_000) < 1e-9);
});

test("customs stacking order", () => {
  const r = customs({ cif: 1_000_000, cd: 10, acd: 2, rd: 0, fed: 0, ast: 0, wht: 5 }, fy202627);
  assert.ok(Math.abs(r.av - 1_010_000) < 1e-6);
  assert.ok(Math.abs(r.total - 391_556.8) < 0.01);
});

const { whtOn, validateWhtRows, propertyGainsTax, zakatCalc } = await import("../lib/engine.ts");

test("WHT table is internally consistent", () =>
  assert.deepEqual(validateWhtRows(fy202627.withholding.rows), []));

test("WHT filer vs non-filer on bank profit", () => {
  const row = fy202627.withholding.rows.find((r) => r.transaction === "Bank account profit");
  const r = whtOn(1_000_000, row);
  assert.equal(r.filer, 200_000);
  assert.equal(r.nonFiler, 400_000);
});

test("WHT tiered non-filer rate (236K property purchase)", () => {
  const row = fy202627.withholding.rows.find((r) => r.section === "236K");
  assert.equal(whtOn(40_000_000, row).nonFilerPct, 10.5);
  assert.equal(whtOn(80_000_000, row).nonFilerPct, 14.5);
  assert.equal(whtOn(150_000_000, row).nonFilerPct, 18.5);
  assert.equal(whtOn(80_000_000, row).filer, 1_000_000);
});

test("Property gains: flat 15% for ATL, post-July-2024 purchase", () => {
  const pg = fy202627.propertyGains;
  const r = propertyGainsTax({ buy: 10_000_000, sell: 15_000_000, acquiredISO: "2025-01-01", propType: "plot", holdingYears: 1, atl: true }, pg, fy202627.salaried);
  assert.equal(r.gain, 5_000_000);
  assert.equal(r.rate, 15);
  assert.equal(r.tax, 750_000);
});

test("Property gains: non-ATL never below 15%", () => {
  const pg = fy202627.propertyGains;
  const r = propertyGainsTax({ buy: 10_000_000, sell: 11_000_000, acquiredISO: "2025-06-01", propType: "plot", holdingYears: 1, atl: false }, pg, fy202627.salaried);
  assert.ok(r.rate >= 15);
  assert.ok(Math.abs(r.tax - r.gain * r.rate / 100) < 0.01);
});

test("Property gains: old regime plot held 7 years = 0%", () => {
  const pg = fy202627.propertyGains;
  const r = propertyGainsTax({ buy: 10_000_000, sell: 15_000_000, acquiredISO: "2018-01-01", propType: "plot", holdingYears: 7, atl: true }, pg, fy202627.salaried);
  assert.equal(r.rate, 0);
  assert.equal(r.tax, 0);
});

test("Property gains: old regime constructed held 1.5 years = 10% (Division VIII)", () => {
  const pg = fy202627.propertyGains;
  const r = propertyGainsTax({ buy: 10_000_000, sell: 12_000_000, acquiredISO: "2020-01-01", propType: "constructed", holdingYears: 1.5, atl: true }, pg, fy202627.salaried);
  assert.equal(r.rate, 10);
  assert.equal(r.tax, 200_000);
});

test("Property gains: old regime flat held 1.5 years = 7.5% (Division VIII)", () => {
  const pg = fy202627.propertyGains;
  const r = propertyGainsTax({ buy: 10_000_000, sell: 12_000_000, acquiredISO: "2020-01-01", propType: "flat", holdingYears: 1.5, atl: true }, pg, fy202627.salaried);
  assert.equal(r.rate, 7.5);
  assert.equal(r.tax, 150_000);
});

test("Property gains: old regime boundary — exactly 1 year stays in the 15% band", () => {
  const pg = fy202627.propertyGains;
  const r = propertyGainsTax({ buy: 10_000_000, sell: 12_000_000, acquiredISO: "2020-01-01", propType: "plot", holdingYears: 1, atl: true }, pg, fy202627.salaried);
  assert.equal(r.rate, 15);
});

test("Property gains: no gain means no tax", () => {
  const pg = fy202627.propertyGains;
  const r = propertyGainsTax({ buy: 15_000_000, sell: 14_000_000, acquiredISO: "2025-01-01", propType: "flat", holdingYears: 1, atl: true }, pg, fy202627.salaried);
  assert.equal(r.tax, 0);
});

test("Zakat: 2.5% above nisab, zero below", () => {
  const z = fy202627.zakat;
  assert.equal(z.nisab, 503_529);
  const due = zakatCalc({ cash: 100_000, bank: 500_000, gold: 200_000, silver: 0, goods: 0, debts: 50_000 }, z);
  assert.equal(due.eligible, true);
  assert.equal(due.zakat, 750_000 * 0.025);
  const notDue = zakatCalc({ cash: 100_000, bank: 100_000, gold: 0, silver: 0, goods: 0, debts: 0 }, z);
  assert.equal(notDue.eligible, false);
  assert.equal(notDue.zakat, 0);
});
