interface HasuraError {
  errors: any
}

export const isError = (data: HasuraResponse<any, any>): data is HasuraError => {
  if (data['error']) {
    return true
  } else {
    return false
  }
}

export type HasuraResponse<queryName extends string, dataType> = HasuraError | {
  data: {
    [K in queryName]: dataType
  }
}
