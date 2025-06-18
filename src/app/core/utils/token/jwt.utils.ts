export class JwtUtils {
    /**
     * Vérifie si le token est expiré.
     * @param token Le token JWT.
     * @returns `true` si le token est expiré, sinon `false`.
     */
    static isTokenExpired(token: string): boolean {
      if (!token) {
        return true;
      }
  
      const decodedToken = this.decodeToken(token);
      if (!decodedToken || !decodedToken.exp) {
        return true;
      }
  
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    }
  
    /**
     * Décode un token JWT sans le valider.
     * @param token Le token JWT.
     * @returns Les données du token ou `null` en cas d'échec.
     */
    static decodeToken(token: string): any {
      if (!token) {
        return null;
      }
  
      try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload); 
        return JSON.parse(decodedPayload);
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT:', error);
        return null;
      }
    }
  
    /**
     * Extrait le rôle de l'utilisateur depuis le token JWT.
     * @param token Le token JWT.
     * @returns Le rôle de l'utilisateur ou `null` si non disponible.
     */
    static getUserRole(token: string): string | null {
      const decodedToken = this.decodeToken(token);
      return decodedToken?.role || null;
    }
  
    /**
     * Extrait le nom d'utilisateur depuis le token JWT.
     * @param token Le token JWT.
     * @returns Le nom d'utilisateur ou `null` si non disponible.
     */
    static getUsername(token: string): string | null {
      const decodedToken = this.decodeToken(token);
      return decodedToken?.sub || null; 
    }
  }
  