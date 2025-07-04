import type { Collector } from "./collector";
import { MvnoCollector } from "./mvno-collector";

export class CollectorFactory {
  private static collectors: Record<string, new () => Collector> = {
    "mvno1": MvnoCollector
  };

  static getCollectorForType(collectorType: string): Collector {
    const CollectorClass = this.collectors[collectorType.toLowerCase()];

    if (!CollectorClass) {
      throw new Error(`No collector found for type: ${collectorType}`);
    }

    return new CollectorClass();
  }

  // NOTE(jan): In a full system this could be used to register collectors.
  static registerCollector(collectorType: string, collectorClass: new () => Collector): void {
    this.collectors[collectorType.toLowerCase()] = collectorClass;
  }
}