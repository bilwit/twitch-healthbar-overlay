const dictionary: { [key: string]: string } = {
  black: '\u001b[30m',
  error: '\u001b[31m',
  success: '\u001b[32m',
  warning: '\u001b[33m',
  // Blue: \u001b[34m
  important: '\u001b[35m',
  health: '\u001b[36m',
  general: '\u001b[37m',
}

export default function consoleLogStyling(type: string, msg: string): string {
  return dictionary?.[type] + msg + dictionary?.[type];
}