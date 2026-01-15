import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.quiznest.app",
    appName: "QuizNest",
    webDir: "out", // dummy, required
    server: {
        url: "http://10.0.2.2:3000", // Android emulator
        cleartext: true
    }
};

export default config;
