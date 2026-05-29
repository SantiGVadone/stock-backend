import type { loginDTO, registerDTO } from '../interfaces/auth'

export const loginServices = async (data: loginDTO) => {
  return { data, success: true, message: 'Usuario logueado correctamente' }
}

export const registerServices = async (data: registerDTO) => {
  return { data, success: true, message: 'Usuario registrado correctamente' }
}
