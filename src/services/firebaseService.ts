export interface FirebaseSensorData {
  sensor: {
    arus: number;    // Current (A)
    biaya: number;   // Cost
    daya: number;    // Power (W) 
    energi: number;  // Energy
    tegangan: number; // Voltage (V)
  };
  status: string;
}

export interface FirebaseConfig {
  url: string;
  authKey: string;
}

class FirebaseService {
  private config: FirebaseConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const savedConfig = localStorage.getItem('firebase-config');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (error) {
        console.error('Failed to parse Firebase config:', error);
      }
    }
  }

  setConfig(config: FirebaseConfig) {
    this.config = config;
    localStorage.setItem('firebase-config', JSON.stringify(config));
  }

  getConfig(): FirebaseConfig | null {
    return this.config;
  }

  isConfigured(): boolean {
    return this.config !== null && !!this.config.url && !!this.config.authKey;
  }

  async fetchSensorData(): Promise<FirebaseSensorData | null> {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured');
    }

    try {
      const url = `${this.config!.url}?auth=${this.config!.authKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate the data structure matches expected format
      if (data && data.sensor && typeof data.status === 'string') {
        return data as FirebaseSensorData;
      } else {
        throw new Error('Invalid data format received from Firebase');
      }
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      throw error;
    }
  }

  // Convert Firebase data to dashboard format
  mapFirebaseToMetrics(firebaseData: FirebaseSensorData) {
    return {
      voltage: firebaseData.sensor.tegangan,
      current: firebaseData.sensor.arus,
      power: firebaseData.sensor.daya,
      cost: firebaseData.sensor.biaya,
      energy: firebaseData.sensor.energi,
      status: firebaseData.status
    };
  }
}

export const firebaseService = new FirebaseService();