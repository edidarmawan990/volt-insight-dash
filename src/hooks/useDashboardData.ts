import { useState, useEffect } from 'react';
import { firebaseService, FirebaseConfig } from '@/services/firebaseService';

export interface MetricData {
  voltage: number;
  current: number;
  power: number;
  cost: number;
  costToday?: number;
  energy?: number;
  status?: string;
}

export interface SocketData {
  id: string;
  name: string;
  isOnline: boolean;
  isOn: boolean;
}

export interface ChartDataPoint {
  time: string;
  voltage: number;
  current: number;
  power: number;
}

export function useDashboardData() {
  const [metrics, setMetrics] = useState<MetricData>({
    voltage: 220.5,
    current: 2.3,
    power: 507.15,
    cost: 0.12
  });

  const [sockets, setSockets] = useState<SocketData[]>([
    { id: '1', name: 'Main Socket', isOnline: true, isOn: true }
  ]);

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUsingFirebase, setIsUsingFirebase] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Check if Firebase is configured on mount
  useEffect(() => {
    setIsUsingFirebase(firebaseService.isConfigured());
  }, []);

  // Function to handle Firebase configuration updates
  const handleFirebaseConfig = (config: FirebaseConfig) => {
    firebaseService.setConfig(config);
    setIsUsingFirebase(true);
    setFirebaseError(null);
  };

  // Generate initial chart data
  useEffect(() => {
    const generateInitialData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 19; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000); // Every minute
        data.push({
          time: time.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          voltage: 220 + Math.random() * 10 - 5, // 215-225V range
          current: 2 + Math.random() * 2 - 1, // 1-3A range  
          power: (220 + Math.random() * 10 - 5) * (2 + Math.random() * 2 - 1) // V * A
        });
      }
      
      setChartData(data);
    };

    generateInitialData();
  }, []);

  // Fetch real Firebase data or simulate data
  useEffect(() => {
    const updateData = async () => {
      if (isUsingFirebase) {
        try {
          const firebaseData = await firebaseService.fetchSensorData();
          if (firebaseData) {
            const mappedMetrics = firebaseService.mapFirebaseToMetrics(firebaseData);
            setMetrics(mappedMetrics);
            
            // Update chart with real data
            setChartData(prev => {
              const newPoint = {
                time: new Date().toLocaleTimeString('en-US', { 
                  hour12: false, 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }),
                voltage: mappedMetrics.voltage,
                current: mappedMetrics.current,
                power: mappedMetrics.power
              };
              return [...prev.slice(1), newPoint];
            });
            
            setFirebaseError(null);
          }
        } catch (error) {
          console.error('Firebase fetch error:', error);
          setFirebaseError(error instanceof Error ? error.message : 'Unknown error');
          // Fall back to mock data if Firebase fails
          setIsUsingFirebase(false);
        }
      } else {
        // Use mock data
        setMetrics(prev => ({
          voltage: 220 + Math.random() * 10 - 5,
          current: 2 + Math.random() * 2 - 1,
          power: prev.voltage * prev.current,
          cost: prev.cost + (prev.power / 1000) * 0.001
        }));

        // Update chart data with mock data
        setChartData(prev => {
          const newPoint = {
            time: new Date().toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            voltage: 220 + Math.random() * 10 - 5,
            current: 2 + Math.random() * 2 - 1,
            power: 0
          };
          newPoint.power = newPoint.voltage * newPoint.current;
          return [...prev.slice(1), newPoint];
        });
      }

      setLastUpdate(new Date());
    };

    updateData();
    const interval = setInterval(updateData, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isUsingFirebase]);

  const toggleSocket = (socketId: string, newState: boolean) => {
    setSockets(prev => 
      prev.map(socket => 
        socket.id === socketId 
          ? { ...socket, isOn: newState }
          : socket
      )
    );
  };

  const isSystemOnline = sockets.some(socket => socket.isOnline);
  const activeDevices = sockets.filter(socket => socket.isOnline && socket.isOn).length;
  const totalDevices = sockets.length;

  return {
    metrics,
    sockets,
    chartData,
    lastUpdate,
    isSystemOnline,
    activeDevices,
    totalDevices,
    toggleSocket,
    isUsingFirebase,
    firebaseError,
    handleFirebaseConfig,
    firebaseConfig: firebaseService.getConfig()
  };
}