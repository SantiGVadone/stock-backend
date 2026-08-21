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
  oldPass: string
  newPass: string
}

export interface refreshDTO {
  refreshToken: string
}
