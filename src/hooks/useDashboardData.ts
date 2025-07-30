import { useState, useEffect } from 'react';

export interface MetricData {
  voltage: number;
  current: number;
  power: number;
  cost: number;
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
    { id: '1', name: 'Main Socket', isOnline: true, isOn: true },
    { id: '2', name: 'Backup Socket', isOnline: true, isOn: false },
    { id: '3', name: 'Emergency Socket', isOnline: false, isOn: false }
  ]);

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

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

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics
      setMetrics(prev => ({
        voltage: 220 + Math.random() * 10 - 5,
        current: 2 + Math.random() * 2 - 1,
        power: prev.voltage * prev.current,
        cost: prev.cost + (prev.power / 1000) * 0.001 // Simple cost calculation
      }));

      // Update chart data
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

        const updated = [...prev.slice(1), newPoint];
        return updated;
      });

      setLastUpdate(new Date());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

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
    toggleSocket
  };
}