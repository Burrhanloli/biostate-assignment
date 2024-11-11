type AuthConfig = {
  session: {
    strategy?: "jwt" | "database";
    maxAge?: number;
  };
};

export const authConfig: AuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 Day
  },
};
