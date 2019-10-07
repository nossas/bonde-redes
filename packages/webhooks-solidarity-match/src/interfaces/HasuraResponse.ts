interface HasuraError {
  errors: any
}

export const isError = (data: HasuraResponse<any>): data is HasuraError => {
  if (data['error']) {
    return true
  } else {
    return false
  }
}

export type HasuraResponse<T> = HasuraError | T
