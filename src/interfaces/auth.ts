export interface loginDTO {
  email: string
  password: string
}

export interface registerDTO {
  name: string
  lastName: string
  phone: string
  email: string
  password: string
}

export interface changePasswordDTO {
  oldPassword: string
  newPassword: string
}

export interface refreshDTO {
  refreshToken: string
}

export interface verifyEmailDTO {
  token: string
}

export interface resendVerificationDTO {
  email: string
}

export interface forgotPasswordDTO {
  email: string
}

export interface resetPasswordDTO {
  token: string
  newPassword: string
  confirmPassword: string
}
