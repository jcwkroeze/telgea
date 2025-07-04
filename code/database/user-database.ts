export interface UserServiceInfo {
  userId: string;
  provider: string;
}

export class UserDatabase {
  private userServiceMappings: UserServiceInfo[] = [
    { userId: "abc123", provider: "mvno1" },
  ];

  async getServiceForUser(userId: string): Promise<string> {
    const mapping = this.userServiceMappings.find(m => m.userId === userId);
    if (!mapping) {
      throw new Error(`No service mapping found for user ${userId}`);
    }
    return mapping.provider;
  }
}