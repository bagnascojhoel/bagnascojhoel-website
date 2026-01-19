export enum Complexity {
  EXTREME = 'extreme',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export const ComplexityLabels: Record<Complexity, string> = {
  [Complexity.EXTREME]: 'Extreme',
  [Complexity.HIGH]: 'High',
  [Complexity.MEDIUM]: 'Medium',
  [Complexity.LOW]: 'Low',
};
