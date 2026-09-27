export interface OrderCreatable<TInput, TOutput> {
  create(input: TInput): Promise<TOutput>;
}

export interface OrderQueryable<TOutput> {
  get(id: string): Promise<TOutput>;
}
