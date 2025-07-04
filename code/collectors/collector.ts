import type { NormalizedUserData } from "../normalizer";

export interface Collector {
    collectUserData(userId: string): Promise<Array<Partial<NormalizedUserData>>>;
}
