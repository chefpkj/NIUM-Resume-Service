import { Request, Response, NextFunction, RequestHandler } from "express";
import path from "path";
import express from "express";

export function serveFrontend(): RequestHandler[] {
  const frontendPath = path.join(
    __dirname,
    "../../../../NIUM-Resume-Service-React/dist"
  );

  return [express.static(frontendPath)];
}
