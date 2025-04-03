export interface DidDto {
  identifier: string;
}

export function createDidDto(data?: Partial<DidDto>): DidDto {
  return {
    identifier: data?.identifier || "",
  };
}
