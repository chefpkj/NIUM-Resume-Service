export function ok<T>(data: T) {
  return { success: true, data };
}

export function fail(message: string, details?: any) {
  return { success: false, message, details };
}
