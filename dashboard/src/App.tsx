/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

function App() {
  const useHeroku = Boolean(new URLSearchParams(window.location.search).get('heroku'))

  // Websocket
  const WS_URL = useHeroku ? "wss://metrics-websocket-server-094fe427096d.herokuapp.com/ws" : "ws://localhost:3001/ws"
  const { lastMessage, readyState } = useWebSocket(WS_URL);
  const [messageHistory, setMessageHistory] = useState([]);
  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev: any) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);
  const connectionStatusPretty = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // API
  const API_BASE_URL = useHeroku ? "https://metrics-api-server-63ea51367e93.herokuapp.com" : "http://localhost:8080"
  const API_URL = `${API_BASE_URL}/metrics-dashboard`
  const [metrics, setMetrics] = useState(null);
  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => setMetrics(data.metrics))
      .catch(error => console.error(error));
  }, [API_URL]);

  // DEBUG PRINTOUTS:
  console.log('pm debug messageHistory', messageHistory);
  console.log('pm debug metrics', metrics);

  return (
    <div>
      <h1>Metrics Dashboard</h1>

      {readyState !== ReadyState.OPEN && <span>WebSocket status: {connectionStatusPretty}</span>}

      <ul>
        {(metrics || []).map((metric: any) => (
          <li key={metric.key}>
            <strong>{metric.key}</strong> min={metric.min} max={metric.max} avg={metric.avg} count={metric.count}
          </li>
        ))}
      </ul>

      <div className="flex items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-6xl px-5 mx-auto my-28">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-5 bg-white rounded shadow-sm">
              <div className="text-base text-gray-400 ">Total Sales</div>
              <div className="flex items-center pt-1">
                <div className="text-2xl font-bold text-gray-900 ">$9850.90</div>
                <span className="flex items-center px-2 py-0.5 mx-2 text-sm text-green-600 bg-green-100 rounded-full">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg>
                              <span>1.8%</span>
                </span>
              </div>
            </div>
            <div className="p-5 bg-white rounded shadow-sm">
              <div className="text-base text-gray-400 ">Net Revenue</div>
              <div className="flex items-center pt-1">
                <div className="text-2xl font-bold text-gray-900 ">$7520.50</div>
                <span className="flex items-center px-2 py-0.5 mx-2 text-sm text-red-600 bg-red-100 rounded-full">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg>
                              <span>2.5%</span>
                </span>
              </div>
            </div>
            <div className="p-5 bg-white rounded shadow-sm">
              <div className="text-base text-gray-400 ">Customers</div>
              <div className="flex items-center pt-1">
                <div className="text-2xl font-bold text-gray-900 ">1375</div>
                <span className="flex items-center px-2 py-0.5 mx-2 text-sm text-green-600 bg-green-100 rounded-full">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg>
                              <span>5.2%</span>
                </span>
              </div>
            </div>
            <div className="p-5 bg-white rounded shadow-sm">
              <div className="text-base text-gray-400 ">MRR</div>
              <div className="flex items-center pt-1">
                <div className="text-2xl font-bold text-gray-900 ">$250.00</div>
                <span className="flex items-center px-2 py-0.5 mx-2 text-sm text-green-600 bg-green-100 rounded-full">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg>
                              <span>2.2%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> 

    </div>
  );
}

export default App
