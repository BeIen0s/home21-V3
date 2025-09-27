/**
 * Utilitaire de logging pour Pass21
 * 
 * Désactive automatiquement les logs en production
 */

const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';
const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

interface Logger {
  log: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

/**
 * Logger principal
 * En production, seuls les erreurs et warnings sont affichés
 */
export const logger: Logger = {
  log: (message: string, ...args: any[]) => {
    if (!isProduction || debugMode) {
      console.log(message, ...args);
    }
  },

  info: (message: string, ...args: any[]) => {
    if (!isProduction || debugMode) {
      console.info(`ℹ️ ${message}`, ...args);
    }
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️ ${message}`, ...args);
  },

  error: (message: string, ...args: any[]) => {
    console.error(`❌ ${message}`, ...args);
  },

  debug: (message: string, ...args: any[]) => {
    if ((!isProduction || debugMode) && typeof window !== 'undefined') {
      console.debug(`🐛 ${message}`, ...args);
    }
  }
};

/**
 * Logger spécialisé pour l'authentification
 */
export const authLogger = {
  login: (email: string) => logger.info(`Login attempt for: ${email}`),
  loginSuccess: (userName: string) => logger.info(`Login successful for: ${userName}`),
  loginError: (error: string) => logger.error(`Login failed: ${error}`),
  logout: () => logger.info('User logout initiated'),
  loadUser: (userName: string) => logger.info(`User loaded: ${userName}`),
  loadError: (error: string) => logger.error(`User load error: ${error}`)
};

/**
 * Logger spécialisé pour les API
 */
export const apiLogger = {
  request: (method: string, url: string) => logger.debug(`API ${method} ${url}`),
  success: (method: string, url: string) => logger.debug(`API ${method} ${url} - Success`),
  error: (method: string, url: string, error: string) => logger.error(`API ${method} ${url} - Error: ${error}`)
};

/**
 * Logger spécialisé pour la navigation
 */
export const navLogger = {
  route: (pathname: string) => logger.debug(`Navigating to: ${pathname}`),
  protected: (pathname: string) => logger.info(`Protected route accessed: ${pathname}`),
  redirect: (from: string, to: string) => logger.info(`Redirecting from ${from} to ${to}`)
};

export default logger;