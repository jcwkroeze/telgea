import type { MvnoResponse } from "../types/mvno";
import type { NormalizedUserData } from "../types/normalizer";
import { config } from "./config";

type MappingConfig = Record<string, string>;

export class Mapper {
  map<SourceType extends MvnoResponse>(source: SourceType): Partial<NormalizedUserData> {
    const result: Partial<NormalizedUserData> = {};

    const responseConfig = config.get(source.telgeaResponseType);
    if (!responseConfig) {
      throw new Error(`No mapping configuration found for response type: ${source.telgeaResponseType}`);
    }

    const needsSmsCharges = Object.keys(responseConfig).some(key => key.startsWith('sms_charges'));
    if (needsSmsCharges) {
      result.sms_charges = [];
    }

    for (const [targetPath, sourcePath] of Object.entries(responseConfig)) {
      if (typeof sourcePath === "string") {
        const value = this.getNestedValue(source, sourcePath);
        if (value !== undefined) {
          this.setNestedValue(result, targetPath, value);
        }
      }
    }

    return result;
  }

  private getNestedValue(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }

    return current;
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof part !== "string" || part === "") {
        continue;
      }
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    if (typeof lastPart === "string" && lastPart !== "") {
      current[lastPart] = value;
    }
  }
}