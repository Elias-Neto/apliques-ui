type TypeCreateSessionPayload = {
  cpf: string;
  password: string;
}

type TypeSessionResponse = {
  token: string;
} 

export type { TypeCreateSessionPayload, TypeSessionResponse }