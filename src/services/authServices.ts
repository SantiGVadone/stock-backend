import type { loginDTO, registerDTO } from '../interfaces/auth'
import * as authRepository from '../repository/authRepository'

export const loginServices = async (data: loginDTO) => {
  try {
    const result = await authRepository.login(data)
    if (!result.success || !result.data) {
      return { success: false, message: 'Error al iniciar sesion', data: null }
    }

    const stores = await authRepository.getUserStores(Number(result.data.id))

    return {
      success: true,
      message: result.message,
      data: {
        ...result.data,
        stores
      }
    }
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
