export interface LoginTokenDto {
    id: number;
    code: number;
    user_email: string;
    codeStatus:boolean;
    createdAt:Date;
    expiredAt:Date;
  }
