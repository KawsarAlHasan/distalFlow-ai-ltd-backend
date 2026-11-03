import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  ip_address: process.env.IP_ADDRESS,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  port: process.env.APP_PORT || process.env.PORT || 7801,
  app_port: process.env.APP_PORT || 7801,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 7803,
  },

  postgres: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
    port: Number(process.env.POSTGRES_PORT) || 7802,
  },

  PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,

  jwt: {
    user_jwt_secret: process.env.USER_JWT_SECRET,
    clinic_admin_jwt_secret: process.env.CLINIC_ADMIN_JWT_SECRET,
    admin_jwt_secret: process.env.ADMIN_JWT_SECRET,
    rig_admin_jwt_secret: process.env.RIG_ADMIN_JWT_SECRET,
    impersonate_jwt_secret: process.env.IMPERSONATION_JWT_SECRET,
    jwt_expire_in: process.env.JWT_EXPIRE_IN,
  },
  email: {
    appName: process.env.APP_NAME,
    emailService: process.env.EMAIL_SERVICE,
    supportEmail: process.env.SUPPORT_EMAIL,
    emailFrom: process.env.EMAIL_FROM,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    emailPort: process.env.EMAIL_PORT,
    emailHost: process.env.EMAIL_HOST,
  },

  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    session_secret: process.env.SESSION_SECRET,
  },
  gemini_api_key: process.env.GEMINI_API_KEY,
};
