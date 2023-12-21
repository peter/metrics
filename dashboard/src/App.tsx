/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

// Used in order to avoid cyclic dependency, see:
// https://brandoncc.dev/blog/how-to-deal-with-circular-dependencies-in-react-hooks/
// Alternative solutions:
// https://dmitripavlutin.com/react-useeffect-infinite-loop/
function useNoRenderRef(currentValue: any) {
  const ref = useRef(currentValue)
  ref.current = currentValue
  return ref
}

function App() {
  const isProduction = window.location.href.includes('vercel.app') || window.location.href.includes('herokuapp.com')

  // API
  const API_BASE_URL = isProduction ? "https://metrics-api-server-63ea51367e93.herokuapp.com" : "http://localhost:8080"
  const API_URL = `${API_BASE_URL}/metrics-dashboard`
  const [metrics, setMetrics] = useState(null);
  const metricsNoRenderRef = useNoRenderRef(metrics);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => setMetrics(data.metrics))
      .catch(error => console.error(error));
  }, [API_URL]);
  
  // Websocket
  const WS_URL = isProduction ? "wss://metrics-websocket-server-094fe427096d.herokuapp.com/ws" : "ws://localhost:3001/ws"
  const { lastMessage, readyState } = useWebSocket(WS_URL);
  useEffect(() => {
    const metrics: any = metricsNoRenderRef.current;
    if (metrics && lastMessage !== null) {
      const { metric: { key: key, value: value } } = JSON.parse(lastMessage.data)
      const metricIndex: any = ((metrics as any) || []).findIndex((m: any) => m.key === key)
      if (metricIndex >= 0) {
        const metric: any = metrics[metricIndex]
        const newMetric = {
          key,
          min: value < metric.min ? value : metric.min,
          max: value > metric.max ? value : metric.max,
          avg: (metric.avg * metric.count + value) / (metric.count + 1),
          count: metric.count + 1
        }
        // Avoiding mutation
        const newMetrics = Object.assign([], metrics, {[metricIndex]: newMetric});
        setMetrics(newMetrics)
      }
    }
  }, [lastMessage, metricsNoRenderRef]);
  const connectionStatusPretty = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div className="p-10">
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Metrics Dashboard
      </h1>

      {readyState !== ReadyState.OPEN && <span>WebSocket status: {connectionStatusPretty}</span>}

      <div className="flex items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      {(metrics || []).map((metric: any) => (
          <div key={metric.key} className="m-3 p-10 bg-white rounded shadow-sm">
            <div className="text-base text-gray-400 "><strong>{metric.key}</strong></div>
            <div className="items-center pt-5">
              <div className="text-2xl font-bold text-gray-900 ">
                {Math.round(metric.avg)}
              </div>
              <div className="mt-2 block text-sm text-green-600 bg-green-100 rounded-full">
                min={metric.min} max={metric.max} avg={Math.round(metric.avg)} count={metric.count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App
