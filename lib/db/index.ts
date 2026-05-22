/**
 * Database abstraction.
 * Uses in-memory store by default — swap to Supabase/Drizzle by setting env vars.
 */

import { createId } from "@paralleldrive/cuid2";
import type { AuditInput, AuditResult } from "../audit-engine/types";
import fs from "fs";
import path from "path";

export interface AuditRecord {
  id: string;
  input: AuditInput;
  result: AuditResult;
  aiSummary: string | null;
  isPublic: boolean;
  email: string | null;
  companyName: string | null;
  role: string | null;
  teamSize: number | null;
  leadCapturedAt: Date | null;
  createdAt: Date;
  ipHash: string | null;
}

const DB_FILE = path.join(process.cwd(), ".local-db.json");

function readDB(): Map<string, AuditRecord> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      const map = new Map<string, AuditRecord>();
      for (const [k, v] of Object.entries(parsed)) {
        map.set(k, {
          ...(v as AuditRecord),
          createdAt: new Date((v as AuditRecord).createdAt),
          leadCapturedAt: (v as AuditRecord).leadCapturedAt ? new Date((v as AuditRecord).leadCapturedAt!) : null,
        });
      }
      return map;
    }
  } catch (e) {
    console.error("Error reading DB", e);
  }
  return new Map<string, AuditRecord>();
}

function writeDB(store: Map<string, AuditRecord>) {
  try {
    const obj = Object.fromEntries(store);
    fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing DB", e);
  }
}

// In-memory cache for fast reads, but we always sync
const globalForStore = globalThis as unknown as { store: Map<string, AuditRecord> };
const store = globalForStore.store || readDB();
if (process.env.NODE_ENV !== "production") globalForStore.store = store;

export async function createAudit(data: {
  input: AuditInput;
  result: AuditResult;
  aiSummary: string | null;
  ipHash?: string;
}): Promise<AuditRecord> {
  const currentStore = readDB(); // Read latest state to avoid race conditions across processes
  const record: AuditRecord = {
    id: createId(),
    input: data.input,
    result: data.result,
    aiSummary: data.aiSummary,
    isPublic: true,
    email: null,
    companyName: null,
    role: null,
    teamSize: null,
    leadCapturedAt: null,
    createdAt: new Date(),
    ipHash: data.ipHash ?? null,
  };

  currentStore.set(record.id, record);
  writeDB(currentStore);
  globalForStore.store = currentStore;
  return record;
}

export async function getAuditById(id: string): Promise<AuditRecord | null> {
  const currentStore = readDB(); // Read latest
  return currentStore.get(id) ?? null;
}

export async function updateAuditLead(
  id: string,
  data: {
    email: string;
    companyName?: string;
    role?: string;
    teamSize?: number;
  }
): Promise<AuditRecord | null> {
  const currentStore = readDB();
  const record = currentStore.get(id);
  if (!record) return null;

  record.email = data.email;
  record.companyName = data.companyName ?? null;
  record.role = data.role ?? null;
  record.teamSize = data.teamSize ?? null;
  record.leadCapturedAt = new Date();

  currentStore.set(id, record);
  writeDB(currentStore);
  globalForStore.store = currentStore;
  return record;
}

/**
 * Get public audit data (strips PII)
 */
export async function getPublicAudit(id: string) {
  const record = await getAuditById(id);
  if (!record || !record.isPublic) return null;

  return {
    id: record.id,
    input: record.input,
    result: record.result,
    aiSummary: record.aiSummary,
    createdAt: record.createdAt,
  };
}
