export interface Service {
  id: number;
  name: string;
  description: string;
  requirements: string | null;
  type: string;
  price: number;
  sampleMethodIds?: number[];
  createAt: string;
  updateAt: string;
}
