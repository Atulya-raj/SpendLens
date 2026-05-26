/**
 * Database abstraction.
 * Connects to Supabase Postgres when env variables are available,
 * otherwise falls back to local JSON file store (used for tests and offline development).
 */

import { createId } from "@paralleldrive/cuid2";
import { createClient } from "@supabase/supabase-js";
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

// 1. Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

interface DBRow {
  id: string;
  input: AuditInput;
  result: AuditResult;
  ai_summary: string | null;
  is_public: boolean;
  email: string | null;
  company_name: string | null;
  role: string | null;
  team_size: number | null;
  lead_captured_at: string | null;
  created_at: string;
  ip_hash: string | null;
}

// 2. Helper to map Supabase snake_case rows to camelCase AuditRecord
function mapRowToRecord(row: DBRow): AuditRecord {
  return {
    id: row.id,
    input: row.input,
    result: row.result,
    aiSummary: row.ai_summary,
    isPublic: row.is_public,
    email: row.email,
    companyName: row.company_name,
    role: row.role,
    teamSize: row.team_size,
    leadCapturedAt: row.lead_captured_at ? new Date(row.lead_captured_at) : null,
    createdAt: new Date(row.created_at),
    ipHash: row.ip_hash,
  };
}

// 3. Fallback Local JSON File Database Logic
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

// Global cache for JSON storage fallback
const globalForStore = globalThis as unknown as { store: Map<string, AuditRecord> };
const store = globalForStore.store || readDB();
if (process.env.NODE_ENV !== "production") globalForStore.store = store;

// 4. Exposed Database Operations
export async function createAudit(data: {
  input: AuditInput;
  result: AuditResult;
  aiSummary: string | null;
  ipHash?: string;
}): Promise<AuditRecord> {
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

  if (supabase) {
    const { error } = await supabase
      .from("audits")
      .insert({
        id: record.id,
        input: record.input,
        result: record.result,
        ai_summary: record.aiSummary,
        is_public: record.isPublic,
        email: record.email,
        company_name: record.companyName,
        role: record.role,
        team_size: record.teamSize,
        lead_captured_at: record.leadCapturedAt,
        created_at: record.createdAt.toISOString(),
        ip_hash: record.ipHash,
      });

    if (error) {
      console.error("Supabase createAudit error:", error);
      throw error;
    }
    return record;
  }

  // Local Fallback
  const currentStore = readDB();
  currentStore.set(record.id, record);
  writeDB(currentStore);
  globalForStore.store = currentStore;
  return record;
}

export async function getAuditById(id: string): Promise<AuditRecord | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Supabase getAuditById error:", error);
      return null;
    }
    if (!data) return null;
    return mapRowToRecord(data);
  }

  // Local Fallback
  const currentStore = readDB();
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
  if (supabase) {
    const leadCapturedAt = new Date();
    const { data: updatedData, error } = await supabase
      .from("audits")
      .update({
        email: data.email,
        company_name: data.companyName ?? null,
        role: data.role ?? null,
        team_size: data.teamSize ?? null,
        lead_captured_at: leadCapturedAt.toISOString(),
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase updateAuditLead error:", error);
      return null;
    }
    if (!updatedData) return null;
    return mapRowToRecord(updatedData);
  }

  // Local Fallback
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
