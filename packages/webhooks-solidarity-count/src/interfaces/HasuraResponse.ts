interface HasuraError {
  errors: any
}

export type HasuraResponse<T> = HasuraError | T
