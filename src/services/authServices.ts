import type { loginDTO, registerDTO } from '../interfaces/auth'
import * as authRepository from '../repository/authRepository'

export const loginServices = async (data: loginDTO) => {
  try {
    const result = await authRepository.login(data)
    return result
  } catch (error) {
    return { success: false, message: 'Error al iniciar sesion', data: null }
  }
}

export const registerServices = async (data: registerDTO) => {
  try {
    const result = await authRepository.register(data)
    return result
  } catch (error) {
    return {
      success: false,
      message: 'Error al registrar el usuario',
      data: null
    }
  }
}
