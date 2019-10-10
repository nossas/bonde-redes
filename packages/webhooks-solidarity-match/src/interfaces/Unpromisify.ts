type Unpromise<T> = T extends Promise<infer U> ? U : never

export default Unpromise
