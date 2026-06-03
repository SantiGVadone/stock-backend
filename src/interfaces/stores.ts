export interface Store {
  id: string
  name: string
  location?: string
  phone?: string
}

export type CreateStoreDTO = Omit<Store, 'id'>

export type UpdateStoreDTO = Partial<CreateStoreDTO>
