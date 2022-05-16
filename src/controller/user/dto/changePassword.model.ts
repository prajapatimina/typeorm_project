export interface ChangePasswordDto {
    id: number;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }