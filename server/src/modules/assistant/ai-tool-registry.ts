import { Injectable, Logger } from '@nestjs/common';

export const ALLOWED_ASSISTANT_TOOLS = [
  'search_opportunities',
  'search_workspace_chunks',
  'verify_eligibility',
  'extract_deliverables',
] as const;

export type AllowedAssistantToolName = (typeof ALLOWED_ASSISTANT_TOOLS)[number];

export interface ExecutedToolTrace {
  name: string;
  args: Record<string, any>;
  result: any;
  status: 'OK' | 'DENIED' | 'ERROR' | 'BUDGET_EXCEEDED';
  latencyMs: number;
}

export class ToolExecutionBudget {
  private readonly traces: ExecutedToolTrace[] = [];

  constructor(private readonly maxCalls: number = 4) {}

  getTraces(): ExecutedToolTrace[] {
    return [...this.traces];
  }

  getRemaining(): number {
    return Math.max(0, this.maxCalls - this.traces.length);
  }

  addTrace(trace: ExecutedToolTrace): void {
    this.traces.push(trace);
  }
}

@Injectable()
export class AiToolRegistry {
  readonly maxToolCallsPerTurn = 4;
  private readonly logger = new Logger(AiToolRegistry.name);
  private readonly allowlist = new Set<string>(ALLOWED_ASSISTANT_TOOLS);

  isToolAllowed(toolName: string): toolName is AllowedAssistantToolName {
    return this.allowlist.has(toolName);
  }

  createBudget(maxCalls: number = this.maxToolCallsPerTurn): ToolExecutionBudget {
    return new ToolExecutionBudget(maxCalls);
  }

  async executeBounded<T>(
    budget: ToolExecutionBudget,
    toolName: string,
    args: Record<string, any>,
    executor: () => Promise<T>,
  ): Promise<{ ok: boolean; data?: T; trace: ExecutedToolTrace }> {
    const startMs = Date.now();

    if (!this.isToolAllowed(toolName)) {
      const deniedTrace: ExecutedToolTrace = {
        name: toolName,
        args,
        result: { error: `Tool "${toolName}" is not in the explicit Cambium assistant allowlist.` },
        status: 'DENIED',
        latencyMs: Date.now() - startMs,
      };
      budget.addTrace(deniedTrace);
      this.logger.warn(`Blocked disallowed AI tool invocation: ${toolName}`);
      return { ok: false, trace: deniedTrace };
    }

    if (budget.getRemaining() <= 0) {
      const budgetTrace: ExecutedToolTrace = {
        name: toolName,
        args,
        result: { error: `Per-turn tool budget (${this.maxToolCallsPerTurn}) exhausted.` },
        status: 'BUDGET_EXCEEDED',
        latencyMs: Date.now() - startMs,
      };
      budget.addTrace(budgetTrace);
      return { ok: false, trace: budgetTrace };
    }

    try {
      const data = await executor();
      const okTrace: ExecutedToolTrace = {
        name: toolName,
        args,
        result: data,
        status: 'OK',
        latencyMs: Date.now() - startMs,
      };
      budget.addTrace(okTrace);
      return { ok: true, data, trace: okTrace };
    } catch (err: any) {
      const errTrace: ExecutedToolTrace = {
        name: toolName,
        args,
        result: { error: err?.message || 'Tool execution failure' },
        status: 'ERROR',
        latencyMs: Date.now() - startMs,
      };
      budget.addTrace(errTrace);
      return { ok: false, trace: errTrace };
    }
  }
}
