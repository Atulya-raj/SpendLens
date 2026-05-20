/**
 * Database abstraction.
 * Uses in-memory store by default — swap to Supabase/Drizzle by setting env vars.
 */

import { createId } from "@paralleldrive/cuid2";
import type { AuditInput, AuditResult } from "../audit-engine/types";

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

// In-memory store for development
const store = new Map<string, AuditRecord>();

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

  store.set(record.id, record);
  return record;
}

export async function getAuditById(id: string): Promise<AuditRecord | null> {
  return store.get(id) ?? null;
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
  const record = store.get(id);
  if (!record) return null;

  record.email = data.email;
  record.companyName = data.companyName ?? null;
  record.role = data.role ?? null;
  record.teamSize = data.teamSize ?? null;
  record.leadCapturedAt = new Date();

  store.set(id, record);
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
