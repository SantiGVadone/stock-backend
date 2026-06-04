import type { CreateStoreDTO, UpdateStoreDTO } from '../interfaces/stores'
import * as storesRepository from '../repository/storesRepository'
import { newUserStores } from '../repository/userStoresRepository'

// funcion que obtiene todas las stores a las que el usuario tiene acceso
export const getAllStoresServices = async (userId: number) => {
  try {
    const result = await storesRepository.getAllStores(userId)
    if (!result.success) {
      return {
        success: false,
        message: 'Error al obtener las tiendas',
        data: null
      }
    }
    return {
      success: result.success,
      message: result.message,
      data: result.data
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al obtener las tiendas',
      data: null
    }
  }
}

export const createStoreServices = async (
  data: CreateStoreDTO,
  userId: number
) => {
  try {
    const result = await storesRepository.createStore(data)
    if (!result.success) {
      return {
        success: false,
        message: 'Error al crear la tienda',
        data: null
      }
    }
    const storeData = result.data
    if (storeData === null) {
      return {
        success: false,
        message: 'Error al crear la tienda se devolvio un null',
        data: null
      }
    }
    const resultUserStores = await newUserStores(storeData, userId, 'jefe')

    if (!resultUserStores.success) {
      return {
        success: false,
        message: 'Error al crear la tienda',
        data: null
      }
    }

    return {
      success: result.success,
      message: result.message,
      data: [result.data, resultUserStores.data]
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al crear la tienda',
      data: null
    }
  }
}

export const updateStoreServices = async (
  data: UpdateStoreDTO,
  currentRole: string,
  currentStoreId: number
) => {
  try {
    if (currentRole === 'empleado') {
      return {
        success: false,
        message: 'Error: Solo el dueño puede modificar la tienda',
        data: null
      }
    }
    // si es superadmin o jefe puede modificarlo
    const result = await storesRepository.updateStore(data, currentStoreId)
    if (!result.success) {
      return {
        success: false,
        message: 'Error al actualizar la tienda',
        data: null
      }
    }
    return {
      success: result.success,
      message: result.message,
      data: result.data
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al actualizar la tienda',
      data: null
    }
  }
}

export const deleteStore = async (id: number, currentRole: string) => {
  try {
    if (currentRole === 'empleado') {
      return {
        success: false,
        message: 'Error, solo el jefe puede eliminar la tienda',
        data: null
      }
    }

    const result = await storesRepository.deleteStore(id)

    if (!result.success) {
      return {
        success: false,
        message: 'Error al eliminar la tienda',
        data: null
      }
    }
    return {
      success: result.success,
      message: result.message,
      data: result.data
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al eliminar la tienda',
      data: null
    }
  }
}

export const getStoreByIdServices = async (userId: number, storeId: number) => {
  try {
    const result = await storesRepository.getStoreById(userId, storeId)
    if (!result.success) {
      return {
        success: false,
        message: 'Error al obtener la tienda por ID',
        data: null
      }
    }
    return {
      success: result.success,
      message: result.message,
      data: result.data
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error al obtener la tienda por ID',
      data: null
    }
  }
}
