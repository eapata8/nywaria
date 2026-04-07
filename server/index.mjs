import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildAdminData,
  buildPublicData,
  createBooking,
  getAvailabilityForDate,
  getAvailabilityRange,
  readStore,
  saveAdminData,
  updateBooking,
} from "./store.mjs";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const DIST_DIR = path.resolve(process.cwd(), "dist");
const sessions = new Map();

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(payload);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk.toString("utf8");
      if (body.length > 1_000_000) {
        reject(new Error("Payload trop volumineux."));
      }
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("JSON invalide."));
      }
    });

    request.on("error", reject);
  });
}

function getTokenFromRequest(request) {
  const authHeader = request.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }

  return authHeader.slice("Bearer ".length).trim();
}

function requireAdmin(request) {
  const token = getTokenFromRequest(request);
  const session = sessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (token) {
      sessions.delete(token);
    }
    return null;
  }

  return session;
}

function parseQuery(urlObject, key, fallback = "") {
  return urlObject.searchParams.get(key) || fallback;
}

function handleApiError(response, error) {
  sendJson(response, 400, {
    error: error instanceof Error ? error.message : "Erreur inconnue.",
  });
}

function cleanupExpiredSessions() {
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < Date.now()) {
      sessions.delete(token);
    }
  }
}

function canServeClient() {
  return fs.existsSync(path.join(DIST_DIR, "index.html"));
}

function safeFilePath(requestPath) {
  const sanitized = requestPath === "/" ? "/index.html" : requestPath;
  const resolved = path.resolve(DIST_DIR, `.${sanitized}`);
  if (!resolved.startsWith(DIST_DIR)) {
    return null;
  }
  return resolved;
}

function serveStaticFile(response, requestedPath) {
  if (!canServeClient()) {
    sendText(
      response,
      200,
      "Frontend build not found. Use npm run dev for development or npm run build before npm start.",
    );
    return;
  }

  const resolvedFile = safeFilePath(requestedPath);
  if (resolvedFile && fs.existsSync(resolvedFile) && fs.statSync(resolvedFile).isFile()) {
    const extension = path.extname(resolvedFile).toLowerCase();
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
    });
    response.end(fs.readFileSync(resolvedFile));
    return;
  }

  const indexFile = path.join(DIST_DIR, "index.html");
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
  });
  response.end(fs.readFileSync(indexFile));
}

async function routeRequest(request, response) {
  cleanupExpiredSessions();

  const urlObject = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const pathname = urlObject.pathname;

  try {
    if (pathname === "/api/health" && request.method === "GET") {
      sendJson(response, 200, { ok: true });
      return;
    }

    if (pathname === "/api/bootstrap" && request.method === "GET") {
      sendJson(response, 200, buildPublicData(readStore()));
      return;
    }

    if (pathname === "/api/availability" && request.method === "GET") {
      const store = readStore();
      const serviceId = parseQuery(urlObject, "serviceId");
      const date = parseQuery(urlObject, "date");
      const staffId = parseQuery(urlObject, "staffId");
      sendJson(response, 200, getAvailabilityForDate(store, serviceId, date, staffId));
      return;
    }

    if (pathname === "/api/availability-range" && request.method === "GET") {
      const store = readStore();
      const serviceId = parseQuery(urlObject, "serviceId");
      const from = parseQuery(urlObject, "from");
      const days = Number(parseQuery(urlObject, "days", "10"));
      const staffId = parseQuery(urlObject, "staffId");
      sendJson(response, 200, {
        days: getAvailabilityRange(store, serviceId, from, days, staffId),
      });
      return;
    }

    if (pathname === "/api/bookings" && request.method === "POST") {
      const body = await readBody(request);
      sendJson(response, 201, createBooking(body));
      return;
    }

    if (pathname === "/api/admin/login" && request.method === "POST") {
      const body = await readBody(request);
      const store = readStore();
      if ((body.pin || "").trim() !== store.settings.adminPin) {
        sendJson(response, 401, { error: "Code admin invalide." });
        return;
      }

      const token = crypto.randomUUID();
      const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
      sessions.set(token, { token, expiresAt });

      sendJson(response, 200, {
        token,
        expiresAt,
      });
      return;
    }

    if (pathname === "/api/admin/data") {
      const session = requireAdmin(request);
      if (!session) {
        sendJson(response, 401, { error: "Session admin expiree." });
        return;
      }

      if (request.method === "GET") {
        sendJson(response, 200, buildAdminData(readStore()));
        return;
      }

      if (request.method === "PUT") {
        const body = await readBody(request);
        sendJson(response, 200, saveAdminData(body));
        return;
      }
    }

    if (pathname.startsWith("/api/admin/bookings/") && request.method === "PATCH") {
      const session = requireAdmin(request);
      if (!session) {
        sendJson(response, 401, { error: "Session admin expiree." });
        return;
      }

      const bookingId = pathname.replace("/api/admin/bookings/", "");
      const body = await readBody(request);
      sendJson(response, 200, { booking: updateBooking(bookingId, body) });
      return;
    }

    if (pathname.startsWith("/api/")) {
      sendJson(response, 404, { error: "Route API introuvable." });
      return;
    }

    serveStaticFile(response, pathname);
  } catch (error) {
    handleApiError(response, error);
  }
}

export function createAppServer() {
  return http.createServer((request, response) => {
    routeRequest(request, response).catch((error) => {
      handleApiError(response, error);
    });
  });
}

export function startServer(port = Number(process.env.PORT || 4000)) {
  const server = createAppServer();
  server.listen(port, () => {
    console.log(`Nywaria server listening on http://localhost:${port}`);
  });
  return server;
}

let server = null;

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  server = startServer();
}

export { server };
