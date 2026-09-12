import { NormalizedTransaction } from './parser';
export declare function parseCaixaOcrText(text: string): NormalizedTransaction[];
export declare function parseCaixaPdf(content: string): Promise<NormalizedTransaction[]>;
