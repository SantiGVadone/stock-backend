import type { CreateStoreDTO } from '../interfaces/stores'
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
