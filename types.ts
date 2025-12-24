
export interface Prize {
  id: string;
  name: string;
  color: string;
  weight: number;
}

export interface Winner {
  prize: Prize;
  timestamp: number;
}
