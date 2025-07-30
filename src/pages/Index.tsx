import { Zap, Activity, DollarSign, Power } from "lucide-react";
import { StatusHeader } from "@/components/dashboard/StatusHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SocketControl } from "@/components/dashboard/SocketControl";
import { ChartWidget } from "@/components/dashboard/ChartWidget";
import { useDashboardData } from "@/hooks/useDashboardData";

const Index = () => {
  const {
    metrics,
    sockets,
    chartData,
    lastUpdate,
    isSystemOnline,
    activeDevices,
    totalDevices,
    toggleSocket
  } = useDashboardData();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <StatusHeader 
          isSystemOnline={isSystemOnline}
          totalDevices={totalDevices}
          activeDevices={activeDevices}
          lastUpdate={lastUpdate}
        />
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Voltage"
            value={metrics.voltage}
            unit="V"
            icon={<Zap className="h-6 w-6" />}
            trend="stable"
            trendValue="±2.1V"
            color="voltage"
            status={metrics.voltage > 230 ? "warning" : metrics.voltage < 200 ? "critical" : "normal"}
          />
          <MetricCard
            title="Current"
            value={metrics.current}
            unit="A"
            icon={<Activity className="h-6 w-6" />}
            trend="up"
            trendValue="+0.3A"
            color="current"
            status={metrics.current > 3 ? "warning" : "normal"}
          />
          <MetricCard
            title="Power"
            value={metrics.power}
            unit="W"
            icon={<Power className="h-6 w-6" />}
            trend="up"
            trendValue="+12.5W"
            color="power"
            status={metrics.power > 600 ? "warning" : "normal"}
          />
          <MetricCard
            title="Cost Today"
            value={metrics.cost}
            unit="$"
            icon={<DollarSign className="h-6 w-6" />}
            trend="up"
            trendValue="+$0.03"
            color="cost"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ChartWidget
            title="Voltage Monitor"
            data={chartData}
            dataKey="voltage"
            color="voltage"
            unit="V"
            type="area"
          />
          <ChartWidget
            title="Current Draw"
            data={chartData}
            dataKey="current"
            color="current"
            unit="A"
            type="area"
          />
          <ChartWidget
            title="Power Consumption"
            data={chartData}
            dataKey="power"
            color="power"
            unit="W"
            type="area"
          />
        </div>

        {/* Socket Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sockets.map(socket => (
            <SocketControl
              key={socket.id}
              socketId={socket.id}
              name={socket.name}
              isOnline={socket.isOnline}
              isOn={socket.isOn}
              onToggle={toggleSocket}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
