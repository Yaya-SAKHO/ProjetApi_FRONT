export const API_ENDPOINTS = {
  ADMIN: {
    AUTH: {
      LOGIN: '/auth/connexion-admin',
    },
    UTILISATEURS: '/admin/utilisateurs',
    PROFIL: '/admin/profil',
    JUSTIFICATIF: (id: string) => `/admin/utilisateurs/${id}/justificatifUrl`,
    ACTIONS: {
      VALIDATION: (id: string) => `/admin/utilisateurs/${id}/validation`,
      SUSPENSION: (id: string) => `/admin/utilisateurs/${id}/suspendre`,
      ACTIVATION: (id: string) => `/admin/utilisateurs/${id}/reactiver`,
      SUPPRESSION: (id: string) => `/admin/utilisateurs/${id}`
    }
  }
};
