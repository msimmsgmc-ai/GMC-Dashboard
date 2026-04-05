import type { Express } from "express";
import { Server } from "http";
import { storage } from "./storage";

export function registerRoutes(httpServer: Server, app: Express) {
  // Seed on startup
  storage.seedData();

  // Get all properties
  app.get("/api/properties", (_req, res) => {
    const props = storage.getProperties();
    res.json(props.sort((a, b) => a.sortOrder - b.sortOrder));
  });

  // Get targets for a year
  app.get("/api/targets/:year", (req, res) => {
    const year = parseInt(req.params.year);
    const tgts = storage.getTargets(year);
    res.json(tgts);
  });

  // Get actuals for a specific quarter
  app.get("/api/actuals/:year/:quarter", (req, res) => {
    const year = parseInt(req.params.year);
    const quarter = req.params.quarter;
    const acts = storage.getActuals(year, quarter);
    res.json(acts);
  });

  // Get all actuals for a year (all quarters)
  app.get("/api/actuals/:year", (req, res) => {
    const year = parseInt(req.params.year);
    const acts = storage.getAllActuals(year);
    res.json(acts);
  });

  // Get findings for a quarter
  app.get("/api/findings/:year/:quarter", (req, res) => {
    const year = parseInt(req.params.year);
    const quarter = req.params.quarter;
    const finds = storage.getFindings(year, quarter);
    res.json(finds);
  });

  // Dashboard summary endpoint - combines everything
  app.get("/api/dashboard/:year/:quarter", (req, res) => {
    const year = parseInt(req.params.year);
    const quarter = req.params.quarter;

    const props = storage.getProperties().sort((a, b) => a.sortOrder - b.sortOrder);
    const tgts = storage.getTargets(year);
    const acts = storage.getActuals(year, quarter);
    const finds = storage.getFindings(year, quarter);

    const data = props.map((prop) => {
      const target = tgts.find((t) => t.propertyId === prop.id && t.quarter === quarter);
      const actual = acts.find((a) => a.propertyId === prop.id);
      const finding = finds.find((f) => f.propertyId === prop.id);

      return {
        property: prop,
        target: target || null,
        actual: actual || null,
        findings: finding ? JSON.parse(finding.bullets) : [],
      };
    });

    res.json({ year, quarter, data });
  });

  return httpServer;
}
