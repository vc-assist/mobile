import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.VCAssist.VCAssist",
  appName: "VC Assist",
  webDir: "frontend/dist",
  server: {
    androidScheme: "https",
    hostname: "localhost",
    cleartext: false,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
