export type LoginResponse = {
  succeeded: boolean;
  message: string;
  validationResultModel: string | null;
  data: {
    token: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    refreshToken: string;
  };
};
