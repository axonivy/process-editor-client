export namespace PID {
  const SEPARATOR = '-';

  export function processId(pid: string): string {
    const index = pid.indexOf(SEPARATOR);
    if (index === -1) {
      return pid;
    }
    return pid.substring(0, index);
  }

  export function fieldId(pid: string): string {
    const lastSeparator = pid.lastIndexOf(SEPARATOR);
    if (lastSeparator === -1) {
      return '';
    }
    return pid.substring(lastSeparator + 1);
  }

  export function createChild(pid: string, fieldId: string): string {
    return `${pid}${SEPARATOR}${fieldId}`;
  }
}
